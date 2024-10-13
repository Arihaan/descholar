import Link from 'next/link';
import { ConnectButton } from './connect';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 bg-opacity-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-400">
              Stellarship
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/scholarships" className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              Scholarships
            </Link>
            <Link href="/addscholarship" className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              Create Scholarship
            </Link>
            <Link href="/addscholarship" className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
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
