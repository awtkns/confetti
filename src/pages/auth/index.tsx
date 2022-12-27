import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { useRouter } from "next/router";

const Auth: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const callbackUrl = `/${
        typeof router.query.room == "string" ? router.query.room : ""
      }`;
      await signIn("google", { callbackUrl });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-16 flex flex-col items-center justify-center px-4">
        <h1 className="mb-8 text-4xl font-bold text-white">👋 Welcome</h1>
        <button
          className="bg-midnightLight ml-4 rounded-full  outline "
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
