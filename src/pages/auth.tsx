import type { NextPage } from "next";
import { useState } from "react";
import { FaArrowRight, FaGithub, FaGoogle } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import Button from "../ui/button";
import Input from "../ui/input";
import PopIn from "../ui/popin";

const Auth: NextPage = () => {
  const auth = useAuth();
  const displayNameState = useState("");
  const error = useState(false);

  const buttonStyle =
    "mb-4 rounded-full bg-white/10 px-4 py-3 font-semibold no-underline hover:bg-white/20";

  const signIn = () => {
    if (!displayNameState[0]) {
      error[1](true);
      throw Error;
    }

    auth.signIn("anonymous", displayNameState[0]);
  };

  return (
    <PopIn className="container mx-auto drop-shadow-xl">
      <div className="sm:mt-16 flex flex-col items-center justify-center rounded-full">
        <h1 className="text-4xl font-extrabold text-white sm:text-[5rem]">
          🎉 Welcome 🎉
        </h1>
        <p className="m-8 text-lg font-bold text-white">
          Choose a display name or sign in
        </p>
        <div className="flex items-center">
          <Input
            type="text"
            className="py-2"
            placeholder="Display Name"
            model={displayNameState}
            error={error}
            enterPressed={signIn}
          />
          <Button
            className="ml-2 rounded-full bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
            onClick={signIn}
            loader={true}
          >
            <FaArrowRight className="h-auto text-inherit " />
          </Button>
        </div>
        <span className="m-4 w-8 rounded-full bg-white/20 pt-0.5"></span>
        <Button
          className={buttonStyle}
          onClick={() => auth.signIn("github")}
          icon={<FaGithub size={20} />}
        >
          Sign in with GitHub
        </Button>{" "}
        <Button
          className={buttonStyle}
          onClick={() => auth.signIn("google")}
          icon={<FaGoogle size={20} />}
        >
          Sign in with Google
        </Button>
      </div>
    </PopIn>
  );
};

export default Auth;
