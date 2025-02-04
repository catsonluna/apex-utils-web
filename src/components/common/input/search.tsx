import { component$, $ } from "@builder.io/qwik";
import { Combobox } from "@qwik-ui/headless";
import { LuCheck, LuChevronDown } from "@qwikest/icons/lucide";

interface SearchProps {
  onChange?: (value: string) => void;
  values: string[];
  label: string;
  disabled?: boolean;
  value?: string;
}

export default component$<SearchProps>(
  ({ onChange, values, label, disabled, value }) => {
    return (
      <Combobox.Root
        class="relative"
        disabled={disabled}
        onChange$={$(function (value: string) {
          if (onChange) {
            onChange(value);
          }
        })}
        value={value}
      >
        <Combobox.Label class="mt-6 block text-left text-2xl font-bold text-white">
          {label}
        </Combobox.Label>
        <Combobox.Control
          class={`flex items-center rounded-lg border border-gray-600 bg-gray-700 shadow-sm transition-colors focus-within:outline-none hover:border-gray-500 ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <Combobox.Input
            class="flex-1 rounded-l-lg bg-transparent px-4 py-4 text-sm text-white placeholder-gray-400 outline-none"
            disabled={disabled}
          />
          <Combobox.Trigger
            class="rounded-r-lg px-4 py-4 transition-colors hover:bg-gray-600"
            disabled={disabled}
          >
            <LuChevronDown class="h-5 w-5 text-gray-400" />
          </Combobox.Trigger>
        </Combobox.Control>
        {!disabled && (
          <Combobox.Popover class="absolute z-10 mt-1 max-h-60 w-[40vw] overflow-auto rounded-lg border border-gray-600 bg-gray-700 shadow-lg">
            {values.map((val) => (
              <Combobox.Item
                key={val}
                class="flex cursor-pointer items-center justify-between px-4 py-4 text-sm text-white hover:bg-gray-600 data-[highlighted]:bg-gray-500"
              >
                <Combobox.ItemLabel>{val}</Combobox.ItemLabel>
                <Combobox.ItemIndicator class="text-blue-400">
                  <LuCheck class="h-5 w-5" />
                </Combobox.ItemIndicator>
              </Combobox.Item>
            ))}
          </Combobox.Popover>
        )}
      </Combobox.Root>
    );
  },
);
