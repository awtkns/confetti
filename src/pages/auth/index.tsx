import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const Auth: NextPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/dash",
      });
    } catch (error) {
      console.log("sdas");
      // toast(
      //   "An error occurred while logging in. Please create an issue about the problem.",
      //   {
      //     icon: "🤔",
      //     style: {
      //       borderRadius: "10px",
      //       background: "#28283E",
      //       color: "#fff",
      //     },
      //   }
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center px-4">
        <h1 className="mb-8 text-4xl">👋 Welcome</h1>
        <button
          className="bg-midnightLight ml-4"
          onClick={handleSignIn}
          // isLoading={loading}
          // loadingText="Loading..."
          // icon={<BsGithub size={17} />}
        >
          Sign in with GitHub
        </button>
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
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Auth;
