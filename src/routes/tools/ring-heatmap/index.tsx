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
  const response = await fetch("https://api.catsonluna.com/world/info");
  const data = await response.json();
  return data;
}

async function getZones() {
  const response = await fetch("https://api.catsonluna.com/zones");
  const data = await response.json();
  return data;
}
