'use client';

import Link from "next/link";
import { ConnectButton } from "./connect";
import Image from "next/image";
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import MissionLink from './MissionLink';

const MenuItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={href}
          className={`block px-6 py-3 text-sm ${
            active ? 'text-orange-400 bg-gray-800' : 'text-gray-300'
          } hover:text-orange-400 hover:bg-gray-800 transition-colors`}
        >
          {children}
        </Link>
      )}
    </Menu.Item>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-transparent backdrop-blur-none border-none absolute w-full z-50 mt-6">
      <div className="max-w-[95%] mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 ml-2">
            <Link href="/">
              <Image
                src="/resources/newlogo.png"
                alt="DeScholar Logo"
                width={150}
                height={150}
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 mr-2">
            <MissionLink />

            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center">
                Scholarships
                <FiChevronDown className="ml-2 -mr-1 h-3 w-3" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-gray-900 bg-opacity-90 backdrop-blur-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 divide-y divide-gray-700">
                  <div>
                    <MenuItem href="/scholarships">
                      View Scholarships
                    </MenuItem>
                  </div>
                  <div>
                    <MenuItem href="/addscholarship">
                      Create Scholarship
                    </MenuItem>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="relative group">
              <button className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium cursor-default">
                Student Loans
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 invisible group-hover:visible transition-all duration-200 whitespace-nowrap">
                <p className="text-xs text-gray-300">Coming Soon</p>
              </div>
            </div>

            <Link
              href="/activity"
              className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              My Activity
            </Link>

            <ConnectButton label="Connect Wallet" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
