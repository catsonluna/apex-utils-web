/* eslint-disable */
import { component$, $ } from "@builder.io/qwik";
import {
  LuDownload,
  LuMapPinned,
  LuSettings,
  LuX,
} from "@qwikest/icons/lucide";
import SearchInput from "~/components/common/input/search";
import html2canvas from "html2canvas";
import Button from "~/components/common/card";


export default component$<{
  zones: string[];
  selectedZone: string;
  worldOptions: string[];
  selectedWorld: string;
  zonePeriods: any;
  zonePeriod: string;
  heatmapVisuals: { blur: number; radius: number };
  heatdata: any;
  onZoneChange: (value: string) => void;
  onWorldChange: (value: string) => void;
  onZonePeriodChange: (value: string) => void;
  onHeatmapVisualsChange: (visuals: { blur?: number; radius?: number }) => void;
}>(
  ({
    zones,
    selectedZone,
    worldOptions,
    selectedWorld,
    heatmapVisuals,
    zonePeriods,
    zonePeriod,
    heatdata,
    onZoneChange,
    onWorldChange,
    onHeatmapVisualsChange,
    onZonePeriodChange,
  }) => {
    return (
      <div id="sidebar" class={"leaflet-sidebar collapsed"}>
        <div class="leaflet-sidebar-tabs">
          <ul
            role="tablist"
            class="flex flex-col items-center justify-center bg-white"
          >
            <li>
              <a href="#home" role="tab">
                <LuMapPinned class="h-full w-full" />
              </a>
            </li>
            <li>
              <a href="#settings" role="tab">
                <LuSettings class="h-full w-full" />
              </a>
            </li>
          </ul>
        </div>
        <div class="leaflet-sidebar-content">
            <div class="leaflet-sidebar-pane" id="home">
            <h1 class="leaflet-sidebar-header">
              Map Settings
              <span class="leaflet-sidebar-close">
              <LuX class="h-[100%] w-[100%]" />
              </span>
            </h1>
            <SearchInput
              label="Select Zone"
              values={zones}
              value={selectedZone}
              onChange={$((value: string) => onZoneChange(value))}
              key={selectedZone}
            />
            <SearchInput
              label="Select Map"
              values={worldOptions}
              value={selectedWorld}
              onChange={$((value: string) => onWorldChange(value))}
              key={selectedZone}
            />
            <SearchInput

              label={"Select Period (" + heatdata.length
                + " zones)"}
              values={zonePeriods}
              value={zonePeriod}
              onChange={$((value: string) => onZonePeriodChange(value))}
              key={selectedZone}
            />
            </div>
          <div class="leaflet-sidebar-pane" id="settings">
            <h1 class="leaflet-sidebar-header">
              Heatmap Settings
              <span class="leaflet-sidebar-close">
                <LuX class="h-[100%] w-[100%]" />
              </span>
            </h1>
            <div class="flex flex-col items-center justify-center">
              <label class="text-lg font-bold text-white">
                Blur: {heatmapVisuals.blur}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={heatmapVisuals.blur}
                onInput$={(e) => {
                  onHeatmapVisualsChange({
                    blur: parseInt((e.target as HTMLInputElement).value),
                  });
                }}
              />
              <label class="text-lg font-bold text-white">
                Radius: {heatmapVisuals.radius}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={heatmapVisuals.radius}
                onInput$={(e) => {
                  onHeatmapVisualsChange({
                    radius: parseInt((e.target as HTMLInputElement).value),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);