import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import Map from "./map";
import { BackTitle } from "~/components/common/backTitle";
import Topbar from "~/components/common/topbar";
import Footer from "~/components/common/footer";
import { API_URL } from "~/utils/consts";
import { DocumentHead } from "@builder.io/qwik-city";
export default component$(() => {
  const worldInfo = useSignal<any>({});
  const zones = useSignal<string[]>([]);
  const isMobile = useSignal(false);

  useVisibleTask$(async () => {
    worldInfo.value = await getWorldInfo();
    zones.value = await getZones();
    
    // Check window width in the browser
    isMobile.value = window.innerWidth < 1024;
    
    // Optional: Listen for resize events
    const handleResize = () => {
      isMobile.value = window.innerWidth < 1024;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  useTask$(({ track }) => {
    track(() => zones.value);
  });

  if (!worldInfo.value || !zones.value) {
    return (
      <>
        <Topbar />
        <main class="flex flex-col items-center justify-center text-center">
          <BackTitle title={`Zone Heatmap`} />
          <div>
            <h1>Loading...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // if the screen size is not atleast 1024px, return the following
  if (isMobile.value) {
    return (
      <>
        <Topbar />
        <main class="flex flex-col items-center justify-center text-center">
          <BackTitle title={`Zone Heatmap`} />
          <div>
            <h1 class="text-white">This tool is only available on desktop {":("}</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <main class="flex flex-col items-center justify-center text-center">
        <BackTitle title={`Zone Heatmap`} />
        <div class="mb-16">
          <Map zones={zones.value} worldInfo={worldInfo.value} />
        </div>
      </main>
      <Footer />
    </>
  );
});

async function getWorldInfo() {
  const response = await fetch(`${API_URL}/world/info`);
  const data = await response.json();
  return data;
}

async function getZones() {
  const response = await fetch(`${API_URL}/zones`);
  const data = await response.json();
  return data;
}

export const head: DocumentHead = {
  title: "Ring heatmap",
  meta: [
    {
      name: "description",
      content:
        "Heatmap for Apex end rings",
    },
    {
      property: "og:title", // Changed 'name' to 'property' for better compatibility
      content: "Apex Utils Web",
    },
    {
      property: "og:description",
      content:
        "Heatmap for Apex end rings",
    },
    {
      property: "og:image",
      content: "https://apex-utils.catsonluna.com/icon-small.png",
    },
    {
      property: "og:image:width",
      content: "300", // Or "512"
    },
    {
      property: "og:image:height",
      content: "300", // Or "512"
    },
    {
      property: "og:url", // Ensures correct URL when shared
      content: "https://apex-utils.catsonluna.com/",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:site",
      content: "@catsonluna",
    },
    {
      name: "twitter:creator",
      content: "@catsonluna",
    },
    {
      name: "twitter:title",
      content: "Apex Utils Web",
    },
    {
      name: "twitter:description",
      content:
        "Heatmap for Apex end rings",
    },
    {
      name: "twitter:image",
      content: "https://apex-utils.catsonluna.com/icon-small.png",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "keywords",
      content:
        "Apex Legends, Apex Legends Stats, Apex Legends Analysis, Apex Tools, Apex Legends Insights, Apex Legends Tools, Apex Legends Utility, Apex Legends Utility Tool, Apex Utils, Apex Utils Web",
    },
    {
      name: "author",
      content: "catsonluna",
    },
    {
      name: "language",
      content: "en",
    },
    {
      name: "theme-color",
      content: "#b00b69", // Changes the mobile browser color to match branding (optional)
    },
  ],
  links: [
    // Canonical URL (Prevents duplicate content issues)
    {
      rel: "canonical",
      href: "https://apex-utils.catsonluna.com/",
    },
  ],
};
