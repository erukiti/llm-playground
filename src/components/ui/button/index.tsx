import { ComponentPropsWithRef, FC, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const buttonClass = tv({
  base: "rounded-lg border-2 px-7 py-2",
  variants: {
    color: {
      primary: "bg-green-700 font-bold text-white disabled:bg-opacity-60",
      secondary: "bg-cyan-700 font-bold text-white disabled:bg-opacity-60",
      text: "bg-transparent font-bold text-green-700 disabled:text-opacity-60",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

type ButtonProps = ComponentPropsWithRef<"button"> & {
  color?: keyof typeof buttonClass.variants.color;
};

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement>(
  function Button({ children, color, className, ...props }: ButtonProps, ref) {
    const c = twMerge(buttonClass({ color }), className);

    return (
      <button className={c} {...props} ref={ref}>
        {children}
      </button>
    );
  }
);
