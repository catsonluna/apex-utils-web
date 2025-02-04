import { component$, Slot, $ } from "@builder.io/qwik";

interface CardProps {
  onClick$?: () => void;
  disabled?: boolean;
}

export default component$<CardProps>(
  ({ onClick$, disabled }) => {  


    return (
    <button
      class={`group relative mb-2 me-2 inline-flex items-center justify-center
       overflow-hidden rounded-lg bg-gradient-to-br from-purple-500
        to-pink-500 p-0.5 text-sm font-medium
         hover:text-white focus:outline-none focus:ring-4
          group-hover:from-purple-500 group-hover:to-pink-500
        text-white focus:ring-purple-800
        m-5
           ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
           `}
      onClick$={$(function() {
        if (!disabled && onClick$) onClick$();
      })}
      aria-disabled={disabled}
    >
      <span 
      class={`relative rounded-md px-5 py-2.5 
      transition-all duration-75 ease-in 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-gray-900 group-hover:bg-transparent'}
        ${disabled ? 'text-black' : 'text-white'}
        text-xl font-medium text-white
        w-full h-full
      `}
      >
        <Slot />
      </span>
    </button>
  );
});