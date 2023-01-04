import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaGithub, FaHashtag, FaHome, FaLink, FaUser } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import { Dropdown, DropdownItem } from "../ui/dropdown";

const Header: React.FC = () => {
  const { signOut, session, status } = useAuth();
  const router = useRouter();

  const authenticated = status == "authenticated" && (
    <Dropdown
      title={session?.user?.name || ""}
      icon={<FaHashtag className="h-4 text-inherit" />}
    >
      {status === "authenticated" && (
        <DropdownItem
          icon={<FaUser className="h-4 text-inherit text-white" />}
          onClick={signOut}
        >
          Sign Out
        </DropdownItem>
      )}

      <DropdownItem icon={<FaHome className="h-4 text-inherit" />}>
        <Link href="/">Home</Link>
      </DropdownItem>
      {router.route != "/" && (
        <DropdownItem icon={<FaLink className="h-4 text-inherit" />}>
          <a
            href="https://github.com/awtkns/estimator/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            Report a bug
          </a>
        </DropdownItem>
      )}
    </Dropdown>
  );

  const unauthenticated = status == "unauthenticated" &&
    router.route != "/auth" && <Link href="/auth">Sign In</Link>;

  const github = (
    <a
      href="https://github.com/awtkns/estimator"
      className="right-0 ml-0 block block text-white hover:text-yellow-500"
    >
      <span className="sr-only">Estimator on GitHub</span>
      <FaGithub size="20" />
    </a>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 py-4 ">
        <div className="relative flex items-center ">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="ml-auto pr-4 text-lg text-white hover:text-yellow-500"
            >
              {authenticated || unauthenticated}
            </motion.div>
          </AnimatePresence>
          {github}
        </div>
      </div>
    </header>
  );
};

export default Header;
