import { component$} from "@builder.io/qwik";
import Card from "~/components/common/card";
import Topbar from "~/components/common/topbar";
import Footer from "~/components/common/footer";
import { useNavigate } from "@builder.io/qwik-city";
export default component$(() => {
  const navigation = useNavigate();
  return (
    <>
      <Topbar />
      <main class="flex flex-col items-center text-center">
        <img 
          src="icon.png"
          alt="icon"
          class="w-48 h-48"
          width={192}
          height={192}
        />
        <h1 class="mb-8 text-6xl font-bold">
          <span class="text-6xl text-white">Apex Utils</span> <span class="text-6xl text-trans-blue">Web</span> <span class="text-2xl font-normal">by</span>{" "}
          <span class="text-5xl text-trans-pink">catsonluna</span>
        </h1>
        <p class="text-2xl font-bold w-[60vw]"><span class="text-2xl text-white">Apex Utils</span> is a private application, developed 
        by <span class="text-2xl text-trans-pink">catsonluna</span> as 
        a utility tool for <span class="text-2xl text-apex-red">Apex Legends</span> analysis and undrstanding. <span class="text-2xl text-white">Apex Utils</span> <span class="text-2xl text-trans-blue">Web</span> is the public version of the application, 
           with some select functionality from the original.
          </p>
        <h1 class="text-5xl font-bold mt-8 text-white">Tools</h1>
        <div class="grid grid-cols-1 gap-3">
          <Card onClick$={() => {
            navigation("/tools/loot");
          }}>
            <h1 class="text-4xl font-bold">
              Zone Loot
            </h1>
            <p class="text-m">
              Select a loot zone, and see the possible loot drops, and its odds
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
});