import { component$ } from "@builder.io/qwik";
import Card from "~/components/common/card";
import Topbar from "~/components/common/topbar";
import Footer from "~/components/common/footer";
import { useNavigate } from "@builder.io/qwik-city";
import type { DocumentHead } from '@builder.io/qwik-city';
export default component$(() => {
  const navigation = useNavigate();
  return (
    <>
      <Topbar />
      <main class="flex flex-col items-center text-center">
        <h1 class="mb-8 text-6xl font-bold text-white">Tools</h1>
        <p class="lg:w-[60vw] md:w-[80vw] text-2xl font-bold text-white">
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

export const head: DocumentHead = {
  title: "Apex Utils Web Tools",
  meta: [
    {
      name: "description",
      content: "See all the avilable tools in Apex Utils Web."
    },
    {
      property: "og:title", // Changed 'name' to 'property' for better compatibility
      content: "Apex Utils Web"
    },
    {
      property: "og:description",
      content: "See all the avilable tools in Apex Utils Web."
    },
    {
      property: "og:image",
      content: "https://apex-utils.catsonluna.com/icon-small.png"
    },
    {
      property: "og:image:width",
      content: "300" // Or "512"
    },
    {
      property: "og:image:height",
      content: "300" // Or "512"
    },
    {
      property: "og:url", // Ensures correct URL when shared
      content: "https://apex-utils.catsonluna.com/"
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      name: "twitter:card",
      content: "summary"
    },
    {
      name: "twitter:site",
      content: "@catsonluna"
    },
    {
      name: "twitter:creator",
      content: "@catsonluna"
    },
    {
      name: "twitter:title",
      content: "Apex Utils Web"
    },
    {
      name: "twitter:description",
      content: "See all the avilable tools in Apex Utils Web."
    },
    {
      name: "twitter:image",
      content: "https://apex-utils.catsonluna.com/icon-small.png"
    },
    {
      name: "robots",
      content: "index, follow" 
    },
    {
      name: "keywords",
      content: "Apex Legends, Apex Legends Stats, Apex Legends Analysis, Apex Tools, Apex Legends Insights, Apex Legends Tools, Apex Legends Utility, Apex Legends Utility Tool, Apex Utils, Apex Utils Web"
    },
    {
      name: "author",
      content: "catsonluna"
    },
    {
      name: "language",
      content: "en"
    },
    {
      name: "theme-color",
      content: "#b00b69" // Changes the mobile browser color to match branding (optional)
    }
  ],
  links: [
    // Canonical URL (Prevents duplicate content issues)
    {
      rel: "canonical",
      href: "https://apex-utils.catsonluna.com/"
    }
  ]
};
