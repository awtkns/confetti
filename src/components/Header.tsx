import { Dropdown, DropdownItem } from "../ui/dropdown";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { FaGithub, FaHashtag, FaLink, FaUser } from "react-icons/fa";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [showSignIn, setShowSignIn] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/",
      });
    } catch (ignored) {}
  };

  useEffect(() => {
    setShowSignIn(router.route != "/auth" && status != "authenticated");
  }, [status, router]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 py-4 ">
        <div className="relative flex items-center">
          {(status == "authenticated" && (
            <Dropdown
              title={session?.user?.name || "="}
              className="ml-auto block pr-4 text-lg text-white hover:text-yellow-500"
              icon={<FaHashtag className="h-4 text-inherit" />}
            >
              {status === "authenticated" && (
                <DropdownItem
                  icon={<FaUser className="h-4 text-inherit text-white" />}
                  onClick={handleLogout}
                >
                  Sign Out
                </DropdownItem>
              )}

              <a
                href="https://github.com/awtkns/estimator/issues/new"
                target="_blank"
                rel="noreferrer"
              >
                <DropdownItem icon={<FaLink className="h-4 text-inherit" />}>
                  Report a bug
                </DropdownItem>
              </a>
            </Dropdown>
          )) || (
            <Link
              href="/auth"
              className={`ml-auto block px-4 text-lg text-white hover:text-yellow-500 ${
                showSignIn ? "" : "invisible"
              }`}
            >
              Sign In
            </Link>
          )}
          <a
            href="https://github.com/awtkns/estimator"
            className="right-0 ml-0 block block text-white hover:text-yellow-500"
          >
            <span className="sr-only">Estimator on GitHub</span>
            <FaGithub size="20" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
