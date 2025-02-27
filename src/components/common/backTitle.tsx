import { component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { IoArrowBackCircle } from "@qwikest/icons/ionicons";

interface CardProps {
  title: string;
}

export const BackTitle = component$((props: CardProps) => {
    const nav = useNavigate();
    const loc = useLocation();
  return (
    <div class="flex items-center">
      <div class="font-bold text-5xl hover:text-gray-300 
      hover:cursor-pointer transition-all duration-100 ease-in-out
      ">
        <IoArrowBackCircle
          onClick$={() => loc.prevUrl ? window.history.back() : nav('/')}
        />
      </div>
      <h1 class="m-4 text-6xl font-bold break-words break-all">{props.title}</h1>
    </div>
  );
});
