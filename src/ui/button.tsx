// import Loader from "@/motions/loader";

import type { ForwardedRef } from "react";
import { forwardRef } from "react";

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef(
  (props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => (
    <button
      ref={ref}
      type={props.type}
      disabled={props.disabled || props.isLoading}
      onClick={props.onClick}
      className={
        "text-white transition hover:text-yellow-500 " + props.className
      }
    >
      {props.isLoading ? (
        <>
          {/*<Loader className="mr-2" />*/}
          {props.loadingText ? props.loadingText : "Loading..."}
        </>
      ) : (
        <div className="flex items-center">
          {props.icon ? <div className="mr-2">{props.icon}</div> : null}
          {props.children}
        </div>
      )}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
