import { component$, Slot, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$((props: {}) => {
  const nav = useNavigate();
  return (
    <header
      class="flex w-full items-center justify-between bg-gray-800 p-5 text-white
        "
    >
      <img
        src="/icon.png"
        alt="icon"
        class="h-12 w-12 hover:cursor-pointer hover:opacity-80"
        onClick$={() => nav("/")}
      />
      <div class="flex items-center justify-between">
        <p
          class="text-2xl font-bold hover:cursor-pointer hover:text-gray-300"
          onClick$={() => nav("/tools")}
        >
          Tools
        </p>
        <p
          class="text-2xl font-bold hover:cursor-pointer hover:text-gray-300 m-8"
          onClick$={() => nav("/tools")}
        >
          Github
        </p>
      </div>
    </header>
  );
});
