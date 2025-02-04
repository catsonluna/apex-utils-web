import { component$ } from "@builder.io/qwik";
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
        <h1 class="mb-8 text-6xl font-bold text-white">Tools</h1>
        <p class="w-[60vw] text-2xl font-bold text-white">
          The tools page contains all tools publically released. More tools will
          be released in the future and added here
        </p>
        <div class="grid grid-cols-1 gap-3">
          <Card
            onClick$={() => {
              navigation("/tools/loot");
            }}
          >
            <h1 class="text-4xl font-bold">Zone Loot</h1>
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
