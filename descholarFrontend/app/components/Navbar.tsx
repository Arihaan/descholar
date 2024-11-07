import Link from "next/link";
import { ConnectButton } from "./connect";
import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-transparent backdrop-blur-none border-none absolute w-full z-50 mt-6">
      <div className="max-w-[95%] mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 ml-2">
            <Link href="/">
              <Image
                src="/resources/newlogo.png"
                alt="DeScholar Logo"
                width={175}
                height={175}
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8 mr-2">
            <Link
              href="/scholarships"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
            >
              Scholarships
            </Link>
            <Link
              href="/addscholarship"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
            >
              Create Scholarship
            </Link>
            <Link
              href="/addscholarship"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
            >
              My Applications
            </Link>
            <ConnectButton label="Connect Wallet" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
