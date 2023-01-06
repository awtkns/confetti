import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaGithub, FaHashtag, FaHome, FaLink, FaUser } from "react-icons/fa";

import { Dropdown, DropdownItem } from "@/ui/dropdown";
import Loader from "@/ui/loader";

import { useAuth } from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { signOut, session, status } = useAuth();
  const router = useRouter();

  const authenticated = status == "authenticated" && (
    <Dropdown
      title={session?.user?.name || ""}
      icon={<FaHashtag className="h-4 text-inherit" />}
      loader={false}
    >
      {status === "authenticated" && (
        <DropdownItem
          icon={<FaUser className="h-4 text-inherit text-white" />}
          onClick={signOut}
        >
          Sign Out
        </DropdownItem>
      )}

      {router.route != "/" && (
        <DropdownItem icon={<FaHome className="h-4 text-inherit" />}>
          <Link href="/">Home</Link>
        </DropdownItem>
      )}

      <DropdownItem icon={<FaLink className="h-4 text-inherit" />}>
        <a
          href="https://github.com/awtkns/confetti/issues/new"
          target="_blank"
          rel="noreferrer"
        >
          Report a bug
        </a>
      </DropdownItem>
    </Dropdown>
  );

  const loading = status == "loading" && <Loader />;

  const unauthenticated =
    status == "unauthenticated" && router.route != "/auth" ? (
      <Link href="/auth">Sign In</Link>
    ) : (
      <Link href="/">Home</Link>
    );

  const github = (
    <a
      href="https://github.com/awtkns/confetti"
      className="right-0 ml-0 block block text-white hover:text-yellow-500"
    >
      <span className="sr-only">Confetti on GitHub</span>
      <FaGithub size="20" />
    </a>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-yellow">
      <div className="mx-auto px-4 py-4 ">
        <div className="relative flex items-center ">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="ml-auto pr-4 text-lg text-white hover:text-yellow-500"
            >
              {authenticated || loading || unauthenticated}
            </motion.div>
          </AnimatePresence>
          {github}
        </div>
      </div>
    </header>
  );
};

export default Header;
