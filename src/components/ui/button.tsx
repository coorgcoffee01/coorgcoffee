import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
        /* Brand variants — hero and storefront CTAs */
        gold: "rounded-full bg-gold text-primary-foreground font-semibold tracking-[0.14em] uppercase hover:brightness-95",
        goldOutline:
          "rounded-full border border-gold text-gold font-semibold tracking-[0.14em] uppercase hover:bg-gold-soft",
        forest:
          "rounded-full bg-forest text-secondary-foreground font-semibold tracking-[0.12em] uppercase hover:brightness-110",
        clay: "rounded-full bg-clay text-ink-foreground font-semibold tracking-[0.12em] uppercase hover:brightness-110",
        quiet: "border border-border bg-elevated text-foreground hover:border-gold",
      },
      size: {
        default: "h-11 px-5 py-2 text-[0.95rem]",
        sm: "h-10 rounded-md px-4 text-sm",
        lg: "h-13 rounded-md px-8 text-[0.95rem]",
        xl: "h-14 px-9 text-[0.95rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
