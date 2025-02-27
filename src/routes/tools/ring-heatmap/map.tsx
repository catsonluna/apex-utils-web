import {
  component$,
  useVisibleTask$,
  useSignal,
  noSerialize,
  useTask$,
  $,
} from "@builder.io/qwik";
import Sidebar from "./sidebar";
import { API_URL } from "~/utils/consts";

// Extend Leaflet control to include sidebar
declare module "leaflet" {
  namespace control {
    function sidebar(options: any): any;
  }
}

export default component$<{
  worldInfo: any;
  zones: string[];
}>(({ worldInfo, zones }) => {
  const worlds = useSignal<any>({});
  const world = useSignal<any>({});
  const zone = useSignal<string>("");
  const zonePeriods = useSignal<any>({});

  const mapContainer = useSignal<HTMLElement>();
  const map = useSignal<any>(); // Will hold the Leaflet map instance

  const heatData = useSignal<[number, number, number][]>([]);
  const heatmapLayer = useSignal<any>();
  const imageOverlayLayer = useSignal<any>(); // Signal for image overlay
  const heatmapVisuals = useSignal<any>({
    blur: 13,
    radius: 31,
  });

  const zonePeriod = useSignal<string>("");
  useTask$(async ({ track }) => {
    track(() => zones);
    track(() => worldInfo);

    if (Object.keys(worldInfo).length === 0 || !zones.length) {
      return;
    }
    zone.value = zones[0];
  });
  useTask$(async ({ track }) => {
    track(() => zone.value);
    if (!zone.value) return;

    // Get all available maps for the new zone
    worlds.value = getAllMaps(worldInfo, zone.value);
    // Always reset the selected map to the first available option
    world.value = worlds.value[Object.keys(worlds.value)[0]];

    // Fetch periods for the new zone and always reset to the first period
    zonePeriods.value = await getZonePeriods(zone.value);

    if (zonePeriods.value.length > 0) {
      zonePeriod.value = zonePeriods.value[0];
    }
    let tempZones = await getZoneData(zone.value);

    tempZones = tempZones.filter(
      (point: any) => point.period_key === zonePeriod.value,
    );
    heatData.value = tempZones.map((point: any) => {
      return getZoneCoords(
        point,
        world.value["glasses_offset"] ?? { x: 0, y: 0 },
      );
    });
  });

  if (heatData.value.length === 0) {
    return (
      <main class="flex flex-col items-center justify-center text-center">
        <h1>Loading...</h1>
      </main>
    );
  }

  // Map initialization: dynamic import of Leaflet on the client
  useVisibleTask$(async () => {
    if (typeof window === "undefined" || !mapContainer.value) return;

    const leafletModule = await import("leaflet");
    const L = leafletModule.default;
    await import("leaflet/dist/leaflet.css");
    await import("leaflet.heat");

    // Load Leaflet sidebar v2 CSS
    const cssLink = document.createElement("link");
    cssLink.href =
      "https://cdn.jsdelivr.net/npm/leaflet-sidebar-v2@3.0.0/css/leaflet-sidebar.min.css";
    cssLink.rel = "stylesheet";
    cssLink.onload = () => {
      document
        .querySelector(".leaflet-sidebar-tabs")
        ?.setAttribute("style", "background-color: transparent;");
      document
        .querySelector(".leaflet-sidebar")
        ?.setAttribute(
          "style",
          "border: none; left: 0; top: 0; border-radius: 0;",
        );
      document
        .querySelector(".leaflet-sidebar-content")
        ?.setAttribute("style", "background-color: rgba(0,0,0,0.4);");
    };
    document.head.appendChild(cssLink);

    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/leaflet-sidebar-v2@3.0.0/js/leaflet-sidebar.min.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });

    // Custom CRS configuration
    const crs = L.extend({}, L.CRS.Simple, {
      transformation: new L.Transformation(1, 0, 1, 4096),
    }) as L.CRS;

    // Initialize the map
    const newMap = L.map(mapContainer.value, {
      renderer: L.canvas(), // Use the Canvas renderer to allow html2canvas to capture it
      center: [2048, 2048],
      zoom: -2,
      minZoom: -2,
      maxZoom: 1,
      scrollWheelZoom: true,
      crs: crs,
      attributionControl: false,
      zoomControl: false,
    });

    // Define image bounds and add initial image overlay using current world image
    const bounds = new L.LatLngBounds([0, 0], [4096, 4096]);
    const initialOverlay = L.imageOverlay(world.value["img"]["url"], bounds, {
      crossOrigin: true,
    });
    initialOverlay.addTo(newMap);
    imageOverlayLayer.value = noSerialize(initialOverlay);

    // Create heatmap layer if data is available
    if (heatData.value.length) {
      const newHeatmapLayer = L.heatLayer(heatData.value, {
        radius: heatmapVisuals.value.radius,
        blur: heatmapVisuals.value.blur,
        maxZoom: 1,
      }).addTo(newMap);
      heatmapLayer.value = noSerialize(newHeatmapLayer);
    }

    newMap.fitBounds(bounds);
    newMap.setMaxBounds(bounds);

    // Initialize sidebar
    L.control
      .sidebar({
        container: "sidebar",
        position: "left",
        autopan: false,
      })
      .addTo(newMap);

    map.value = noSerialize(newMap);

    return () => {
      if (map.value) {
        map.value.remove();
      }
    };
  });

  // Update image overlay when the selected world changes
  useTask$(async ({ track }) => {
    track(() => world.value);
    if (!map.value) return;

    const leafletModule = await import("leaflet");
    const L = leafletModule.default;
    const bounds = new L.LatLngBounds([0, 0], [4096, 4096]);

    if (imageOverlayLayer.value) {
      map.value.removeLayer(imageOverlayLayer.value);
    }

    const newOverlay = L.imageOverlay(world.value["img"]["url"], bounds, {
      crossOrigin: true,
    });
    newOverlay.addTo(map.value);
    imageOverlayLayer.value = noSerialize(newOverlay);
  });

  // Update the heatmap layer when heatData changes
  useTask$(({ track }) => {
    track(() => heatData.value);
    if (heatmapLayer.value) {
      heatmapLayer.value.setLatLngs(heatData.value);
    } else if (map.value && heatData.value.length) {
      (async () => {
        const leafletModule = await import("leaflet");
        const L = leafletModule.default;
        const newHeatLayer = L.heatLayer(heatData.value, {
          radius: heatmapVisuals.value.radius,
          blur: heatmapVisuals.value.blur,
          maxZoom: 1,
        }).addTo(map.value);
        heatmapLayer.value = noSerialize(newHeatLayer);
      })();
    }
  });

  // Update heatmap visuals when settings change
  useTask$(({ track }) => {
    const blur = track(() => heatmapVisuals.value.blur);
    const radius = track(() => heatmapVisuals.value.radius);

    if (heatmapLayer.value) {
      heatmapLayer.value.setOptions({ blur, radius });
    }
  });

  return (
    <div
      class={world.value.display_name}
      style={{ position: "relative", height: "1024px", width: "1024px" }}
    >
      <div
        id="map"
        ref={mapContainer}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "transparent",
        }}
      />
      <Sidebar
        zones={zones}
        heatdata={heatData.value}
        selectedZone={zone.value}
        worldOptions={Object.keys(worlds.value).map(
          (key) => worlds.value[key].display_name,
        )}
        selectedWorld={world.value.display_name}
        heatmapVisuals={heatmapVisuals.value}
        onZoneChange={$((value: string) => {
          zone.value = value;
        })}
        onWorldChange={$(async (displayName: string) => {
          const newWorld: any = Object.values(worlds.value).find(
            (w: any) => w.display_name === displayName,
          );
          world.value = newWorld;
          let data = await getZoneData(zone.value);

          // Filter with the new zonePeriod value
          data = data.filter(
            (point: any) => point.period_key === zonePeriod.value,
          );

          heatData.value = data.map((point: any) =>
            getZoneCoords(point, newWorld.glasses_offset ?? { x: 0, y: 0 }),
          );
        })}
        onHeatmapVisualsChange={$((visuals: any) => {
          heatmapVisuals.value = { ...heatmapVisuals.value, ...visuals };
        })}
        zonePeriods={zonePeriods.value}
        zonePeriod={zonePeriod.value}
        onZonePeriodChange={$((value: string) => {
          zonePeriod.value = value;
          (async () => {
            let tempZones = await getZoneData(zone.value);
            tempZones = tempZones.filter(
              (point: any) => point.period_key === zonePeriod.value,
            );
            heatData.value = tempZones.map((point: any) =>
              getZoneCoords(
                point,
                world.value.glasses_offset ?? { x: 0, y: 0 },
              ),
            );
          })();
        })}
      />
    </div>
  );
});

// Helper functions
function getAllMaps(worldInfo: any, zone: string) {
  const worlds: any = {};
  Object.keys(worldInfo["maps"]).forEach((key: any) => {
    const localWorld = worldInfo["maps"][key];
    if (localWorld["identifier"] === zone) {
      worlds[key] = localWorld;
    }
  });
  return worlds;
}

function getZoneCoords(zone: any, offset: any) {
  return [zone.end_ring.y / 4 + offset.y, zone.end_ring.x / 4 + offset.x];
}

async function getZonePeriods(zone: string) {
  const response = await fetch(`${API_URL}/rings/${zone}/periods`);
  const data = await response.json();
  return data.reverse();
}

async function getZoneData(zone: string) {
  const response = await fetch(`${API_URL}/rings/${zone}/final`);
  const data = await response.json();
  return data;
}
