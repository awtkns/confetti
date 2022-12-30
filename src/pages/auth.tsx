import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { useRouter } from "next/router";
import Button from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Auth: NextPage = () => {
  const router = useRouter();

  const handleSignIn = (provider: string) => async () => {
    try {
      const callbackUrl = `/${
        typeof router.query.room == "string" ? router.query.room : ""
      }`;
      await signIn(provider, { callbackUrl });
    } catch (ignored) {}
  };

  const buttonStyle =
    "mb-4 rounded-full bg-white/10 px-4 py-3 font-semibold no-underline hover:bg-white/20";

  return (
    <div className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center rounded-full">
        <h1 className="mb-8 text-4xl font-bold text-white">🎉 Welcome 🎉</h1>
        <p className="text-md mb-8 font-bold text-white">
          Sign in to start estimating
        </p>
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
        <Button
          className={buttonStyle}
          onClick={handleSignIn("anon")}
          icon={<FaGoogle size={20} />}
        >
          Sign in with Local
        </Button>
      </div>
    </div>
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
