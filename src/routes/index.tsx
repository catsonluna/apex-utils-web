import { component$} from "@builder.io/qwik";
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
        <img 
          src="icon-small.png"
          alt="icon"
          class="w-48 h-48"
          width={192}
          height={192}
        />
        <h1 class="mb-8 text-6xl font-bold">
          <span class="text-6xl text-white">Apex Utils</span> <span class="text-6xl text-trans-blue">Web</span> <span class="text-2xl font-normal">by</span>{" "}
          <span class="text-5xl text-trans-pink">catsonluna</span>
        </h1>
        <p class="text-2xl font-bold lg:w-[60vw] md:w-[80vw]"><span class="text-2xl text-white">Apex Utils</span> is a private application, developed 
        by <span class="text-2xl text-trans-pink">catsonluna</span> as 
        a utility tool for <span class="text-2xl text-apex-red">Apex Legends</span> analysis and undrstanding. <span class="text-2xl text-white">Apex Utils</span> <span class="text-2xl text-trans-blue">Web</span> is the public version of the application, 
           with some select functionality from the original.
          </p>
        <h1 class="text-5xl font-bold mt-8 text-white">Tools</h1>
        <div class="grid grid-cols-1 gap-3 pb-8">
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

export const head: DocumentHead = {
  title: "Apex Utils Web",
  meta: [
    {
      name: "description",
      content: "Apex Utils Web is a public version of Apex Utils, a utility tool for analyzing and understanding Apex Legends."
    },
    {
      property: "og:title", // Changed 'name' to 'property' for better compatibility
      content: "Apex Utils Web"
    },
    {
      property: "og:description",
      content: "Apex Utils Web is a public version of Apex Utils, a utility tool for analyzing and understanding Apex Legends."
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
      content: "Apex Utils Web is a public version of Apex Utils, a utility tool for analyzing and understanding Apex Legends."
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
