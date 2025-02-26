import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer
      class="fixed bottom-0 w-full items-center justify-center p-2 text-white text-center z-[10000000000000000000000000]"
    >
      <p class="text-1xl opacity-50">
        &copy; catsonluna
      </p>
    </footer>
  );
});
