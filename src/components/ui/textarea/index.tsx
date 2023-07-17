import { ComponentPropsWithRef, FC, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const textareaClass = tv({
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

type TextfieldProps = ComponentPropsWithRef<"textarea"> & {
  color?: keyof typeof textareaClass.variants.color;
};

export const Textarea: FC<TextfieldProps> = forwardRef<HTMLTextAreaElement>(
  function Textfield({ color, className, ...props }: TextfieldProps, ref) {
    const c = twMerge(textareaClass({ color }), className);

    return <textarea className={c} ref={ref} {...props} />;
  }
);
