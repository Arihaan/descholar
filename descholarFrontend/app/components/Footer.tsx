import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-8">
        <aside>
          <p>
            © Descholar.com
            <br />
            Revolutionizing education funding since 2024
          </p>
        </aside>
        <nav className="flex items-center">
          <Link 
            href="https://x.com/intent/user?screen_name=0xdescholar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-orange-500 transition-colors"
          >
            <FaXTwitter className="w-5 h-5" />
            Follow us on X for Updates
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
