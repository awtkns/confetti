import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { useRouter } from "next/router";
import Button from "../ui/button";
import { FaArrowRight, FaGithub, FaGoogle } from "react-icons/fa";
import Input from "../ui/input";
import { useState } from "react";

const Auth: NextPage = () => {
  const displayNameState = useState("");
  const router = useRouter();

  const handleSignIn = (provider: string, name?: string) => async () => {
    let callbackUrl = `/${
      typeof router.query.room == "string" ? router.query.room : ""
    }`;
    callbackUrl = encodeURI(callbackUrl);

    try {
      const id =
        provider == "anonymous"
          ? window.localStorage.getItem("uuid") || ""
          : "";

      await signIn(provider, { callbackUrl, name, id });
    } catch (ignored) {}
  };

  const buttonStyle =
    "mb-4 rounded-full bg-white/10 px-4 py-3 font-semibold no-underline hover:bg-white/20";

  return (
    <div className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center rounded-full">
        <h1 className="mb-8 text-4xl font-bold text-white">🎉 Welcome 🎉</h1>
        <p className="text-md mb-8 font-bold text-white">
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
            onClick={handleSignIn("anonymous", displayNameState[0])}
          >
            <FaArrowRight className="h-auto text-inherit " />
          </button>
        </div>
        <span className="m-4 w-8 rounded-full bg-white/20 pt-0.5"></span>
        <Button
          className={buttonStyle}
          onClick={handleSignIn("github")}
          icon={<FaGithub size={20} />}
        >
          Sign in with GitHub
        </Button>{" "}
        <Button
          className={buttonStyle}
          onClick={handleSignIn("google")}
          icon={<FaGoogle size={20} />}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession(ctx);
  console.log(session?.user?.email);

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
