import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import Button from "../ui/button";
import { FaArrowRight, FaGithub, FaGoogle } from "react-icons/fa";
import Input from "../ui/input";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import PopIn from "../ui/popin";

const Auth: NextPage = () => {
  const auth = useAuth();
  const displayNameState = useState("");

  const buttonStyle =
    "mb-4 rounded-full bg-white/10 px-4 py-3 font-semibold no-underline hover:bg-white/20";

  return (
    <PopIn className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center rounded-full">
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
          ></Input>
          <button
            className="ml-2 rounded-full bg-white/10 p-2 font-semibold text-white no-underline transition hover:bg-white/20 hover:text-yellow-500"
            onClick={() => auth.signIn("anonymous", displayNameState[0])}
          >
            <FaArrowRight className="h-auto text-inherit " />
          </button>
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: `/${ctx.query.room || ""}`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Auth;
