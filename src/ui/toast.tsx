import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import type { Dispatch, SetStateAction } from "react";
import React from "react";

type Props = {
  model: [boolean, Dispatch<SetStateAction<boolean>>];
  onAction: () => void;
  title: string;
  description: string;
};

const Toast = (props: Props) => {
  const [open, setOpen] = props.model;

  return (
    <ToastPrimitive.Provider swipeDirection={"right"}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "fixed inset-x-4 bottom-4 z-50 w-auto rounded-2xl shadow-lg md:right-4 md:left-auto md:w-full md:max-w-sm",
          "bg-slate-500 sm:bg-white/10",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
          "radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
          "radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
          "radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-4 pl-5">
            <div className="radix w-full">
              <ToastPrimitive.Title className="text-lg font-medium text-white">
                {props.title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="dark:text-gray-10 text-md mt-1 rounded-md bg-slate-800/50 p-1 text-white">
                <pre className="overflow-hidden text-ellipsis">
                  {props.description}
                </pre>
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="mx-4 flex items-center justify-center py-4">
            <div className="flex flex-col ">
              <div className="">
                <ToastPrimitive.Action
                  altText="copy"
                  className="text-md flex w-full items-center justify-center rounded-2xl border border-transparent px-3 py-2 font-medium text-yellow-500 hover:bg-white/20 "
                  onClick={(e) => {
                    e.preventDefault();
                    props.onAction();
                    setOpen(false);
                  }}
                >
                  Copy
                </ToastPrimitive.Action>
              </div>
              <div className="">
                <ToastPrimitive.Close className="text-md flex w-full items-center justify-center rounded-2xl border border-transparent px-3 py-2 font-medium text-white hover:bg-white/20 ">
                  Close
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
