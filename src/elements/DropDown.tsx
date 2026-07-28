import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  type ComponentProps,
  createContext,
  type MouseEvent,
  type ReactNode,
  useContext,
} from "react";
import { twMerge } from "tailwind-merge";

type DropDownProps = {
  title: string;
  children: ReactNode;
  buttonClassName?: string;
  panelClassName?: string;
  tooltip?: string;
  disabled?: boolean;
};

const RootContext = createContext<(() => void) | null>(null);

export function DropDown({
  title,
  children,
  buttonClassName,
  panelClassName,
  tooltip = "",
  disabled = false,
}: DropDownProps) {
  const parentClose = useContext(RootContext);

  const isNested = parentClose !== null;

  return (
    <Popover>
      {({ close }) => {
        const rootClose = parentClose ?? close;

        return (
          <RootContext value={rootClose}>
            <PopoverButton
              title={tooltip}
              disabled={disabled}
              className={twMerge(
                "w-full rounded text-center outline-none transition",
                isNested ? "p-1" : "bg-accent",
                !disabled
                  ? [
                      "cursor-pointer",
                      isNested
                        ? "hover:bg-primary/25"
                        : "hover:scale-93 active:scale-87",
                    ]
                  : "cursor-not-allowed opacity-50",
                buttonClassName,
              )}
            >
              {title}
            </PopoverButton>
            {!disabled && (
              <PopoverPanel
                anchor={`${isNested ? "right start" : "bottom"}`}
                className={twMerge(
                  "bg-secondary text-primary",
                  "border-2 border-primary outline-none",
                  "z-50 flex flex-col rounded-xl p-1 text-sm",
                  isNested ? "ml-2" : "mt-2",
                  panelClassName,
                )}
              >
                {children}
              </PopoverPanel>
            )}
          </RootContext>
        );
      }}
    </Popover>
  );
}

type ItemProps = ComponentProps<"button">;

function Item({
  type = "button",
  onClick,
  children,
  className,
  disabled,
  ...props
}: ItemProps) {
  const closeRoot = useContext(RootContext);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    closeRoot?.();
  }

  return (
    <button
      type={type}
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={twMerge(
        "w-full cursor-pointer rounded p-1 text-center outline-none",
        "hover:bg-primary/25",
        className,
      )}
    >
      {children}
    </button>
  );
}

DropDown.Item = Item;
