import { Dropdown, DropdownItem } from "../ui/dropdown";
import { LinkIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setDisabled(true);
    setClosing(true);
    try {
      await signOut({
        callbackUrl: "/",
      });
    } finally {
      setDisabled(false);
      setClosing(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 py-4 ">
        <div className="relative flex items-center">
          {(status === "unauthenticated" && (
            <Link
              href="/auth"
              className="ml-auto block px-4 text-lg text-white hover:text-yellow-500"
            >
              Sign In
            </Link>
          )) ||
            (status == "authenticated" && (
              <Dropdown
                title={session?.user?.name || "Menu"}
                className="ml-auto block px-4 text-lg text-white hover:text-yellow-500"
                icon={<Bars3Icon className="h-4 text-inherit" />}
              >
                {status === "authenticated" && (
                  <DropdownItem
                    icon={<UserCircleIcon className="h-4 text-inherit" />}
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
                  <DropdownItem
                    icon={<LinkIcon className="h-4 text-inherit" />}
                  >
                    Report a bug
                  </DropdownItem>
                </a>
              </Dropdown>
            ))}
          <a
            href="https://github.com/awtkns/estimator"
            className="right-0 block text-white hover:text-yellow-500"
          >
            <span className="sr-only">Estimator on GitHub</span>
            <svg
              viewBox="0 0 16 16"
              className="h-7 w-7"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;