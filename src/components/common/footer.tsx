import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer
      class="fixed bottom-0 w-full items-center justify-cente p-2 text-white text-center"
    >
      <p
        class="text-1xl opacity-50">
        &copy; catsonluna
      </p>
    </footer>
  );
});
