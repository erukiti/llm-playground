import { ComponentPropsWithRef, FC, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const textfieldClass = tv({
  base: "rounded-lg border-2 p-4 placeholder:text-gray-500",
  variants: {
    color: {
      default: "bg-bg1",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type TextfieldProps = ComponentPropsWithRef<"input"> & {
  color?: keyof typeof textfieldClass.variants.color;
};

export const Textfield: FC<TextfieldProps> = forwardRef<HTMLInputElement>(
  function Textfield({ color, className, ...props }: TextfieldProps, ref) {
    const c = twMerge(textfieldClass({ color }), className);

    return <input className={c} ref={ref} {...props} />;
  }
);
