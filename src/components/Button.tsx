import { clsx } from "clsx";
import { ReactNode, forwardRef } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary";
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event: React.MouseEvent<HTMLElement>) => Promise<any> | void;
  disabled?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, onClick, disabled }: ButtonProps, ref) => {
    const classes = clsx(
      "min-w-[132px] rounded-5 px-6 py-2 text-body-base transition duration-200 disabled:cursor-not-allowed",
      {
        "bg-violet-600 text-white rounded enabled:hover:bg-violet-800 disabled:bg-gray-medium":
          variant === "primary",
        "bg-transparent text-violet-600 rounded ring-2 ring-inset ring-violet-600 enabled:hover:text-violet-800 enabled:hover:ring-violet-800 disabled:text-gray-medium disabled:ring-gray-medium":
          variant === "secondary",
        "bg-transparent text-violet-600 enabled:hover:text-violet-800 disabled:text-gray-medium":
          variant === "tertiary",
      }
    );

    return (
      <button
        ref={ref}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        {children}
      </button>
    );
  }
);

export default Button;
