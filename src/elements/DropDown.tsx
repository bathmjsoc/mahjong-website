"use client";

import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
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
  disabled?: boolean;
};

const RootContext = createContext<(() => void) | null>(null);

export function DropDown({
  title,
  children,
  buttonClassName,
  panelClassName,
  disabled = false,
}: DropDownProps) {
  const parentClose = useContext(RootContext);
  const isNested = parentClose !== null;

  return (
    <Popover>
      {({ close }) => {
        const rootClose = parentClose ?? close;

        return (
          <RootContext.Provider value={rootClose}>
            <PopoverButton
              disabled={disabled}
              className={twMerge(
                "w-full text-center outline-none rounded transition",
                isNested ? "p-1" : "bg-accent",
                !disabled
                  ? [
                      "cursor-pointer",
                      isNested
                        ? "hover:bg-primary/25"
                        : "hover:scale-93 active:scale-87",
                    ]
                  : "opacity-50 cursor-not-allowed",
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
                  "border-primary border-2 outline-none",
                  "flex flex-col rounded-xl text-sm p-1 z-50",
                  isNested ? "ml-2" : "mt-2",
                  panelClassName,
                )}
              >
                {children}
              </PopoverPanel>
            )}
          </RootContext.Provider>
        );
      }}
    </Popover>
  );
}

type ItemProps = ComponentProps<typeof Button>;

function Item({ onClick, children, className, disabled, ...props }: ItemProps) {
  const closeRoot = useContext(RootContext);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    closeRoot?.();
  }

  return (
    <Button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={twMerge(
        "w-full text-center outline-none rounded cursor-pointer p-1",
        "hover:bg-primary/25",
        className,
      )}
    >
      {children}
    </Button>
  );
}

DropDown.Item = Item;
