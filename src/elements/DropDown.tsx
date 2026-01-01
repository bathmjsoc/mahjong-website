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
};

const RootContext = createContext<(() => void) | null>(null);

export function DropDown({
  title,
  children,
  buttonClassName,
  panelClassName,
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
              className={twMerge(
                "w-full text-center outline-none rounded cursor-pointer transition",
                isNested
                  ? "hover:bg-(--primary-color)/25 p-1"
                  : "bg-(--accent-color) hover:scale-93 active:scale-87",
                buttonClassName,
              )}
            >
              {title}
            </PopoverButton>

            <PopoverPanel
              anchor={`${isNested ? "right start" : "bottom"}`}
              className={twMerge(
                "bg-(--secondary-color) text-(--primary-color)",
                "border-(--primary-color) border-2 outline-none",
                "flex flex-col rounded-xl text-sm p-1 z-50",
                isNested ? "ml-2" : "mt-2",
                panelClassName,
              )}
            >
              {children}
            </PopoverPanel>
          </RootContext.Provider>
        );
      }}
    </Popover>
  );
}

type ItemProps = ComponentProps<typeof Button>;

function Item({ onClick, children, className, ...props }: ItemProps) {
  const closeRoot = useContext(RootContext);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    closeRoot?.();
  }

  return (
    <Button
      {...props}
      onClick={handleClick}
      className={twMerge(
        "w-full text-center outline-none rounded cursor-pointer p-1",
        "hover:bg-(--primary-color)/25",
        className,
      )}
    >
      {children}
    </Button>
  );
}

DropDown.Item = Item;
