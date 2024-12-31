"use client";
import Link from "next/link";
import RotatingTypewriter from "./components/RotatingTypewriter";
import { motion } from "framer-motion";
import { FiGlobe, FiLock, FiDollarSign } from "react-icons/fi";
import { HiOutlineLightBulb, HiCheck } from "react-icons/hi";

const COLORS = ['#f97316', '#1f2937'];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat w-full"
        style={{
          backgroundImage: 'url("/resources/webpagebg.png")',
          backgroundSize: '100% auto',
          backgroundColor: '#10081e',
          backgroundPosition: 'top center',
          maxWidth: '100vw',
        }}
      >
      </div>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center py-12 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 mb-24 mt-24">
          {/* Centered heading section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-[120px] font-bold tracking-tight"
                style={{
                  color: '#f2f2f2',
                  textShadow: '6px 6px 0px #733932',
                  fontFamily: 'NewFont, sans-serif'
                }}>
              <div className="flex flex-col items-center">
                <span className="mb-8">Fund your</span>
                <div>
                  <RotatingTypewriter />
                </div>
              </div>
            </h1>

            {/* Description below heading */}
            <div className="max-w-3xl mx-auto mt-12">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10">
                Empowering education globally with secure, decentralized scholarships and student loans (coming soon)
                <span className="block mt-4">
                  <a 
                    href="#mission" 
                    className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('mission')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                  >
                    Learn more about Descholar's mission and how it can help you.
                  </a>
                </span>
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Link href="/scholarships">
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    View Scholarships
                  </button>
                </Link>
                <Link href="/addscholarship">
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Create Scholarship
                  </button>
                </Link>
              </div>

              {/* Stellar powered badge */}
              <div className="flex items-center justify-center space-x-2 mt-12">
                <span className="text-gray-300 md:text-xl">Powered by:</span>
                {/* <a 
                  href="https://stellar.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/resources/stellar-logo.svg" 
                    alt="Stellar Logo" 
                    className="h-12 w-auto"
                  />
                </a> */}
                <a 
                  href="https://educhain.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/resources/EDUChainLogo.png" 
                    alt="EDU Chain" 
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* The Problem section */}
        <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-24 mb-16 bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-white">The Problem</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The global education financing gap continues to grow, leaving millions of students without access to quality education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Market Size */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex flex-col items-start h-full">
                <h3 className="text-lg font-medium text-gray-400 mb-4">Global Student Loan Market</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-orange-500">$3.8T</span>
                </div>
                <div className="mt-auto flex items-center justify-between w-full">
                  <span className="text-sm text-gray-400">Growing yearly with increasing education costs</span>
                  <a 
                    href="https://www.globenewswire.com/news-release/2024/06/17/2899473/28124/en/Global-Student-Loan-Market-Report-2024-Market-Value-to-Reach-3-800-Billion-by-2029-Student-Loans-Continue-to-Rise-Across-All-Demographics.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    Mordor Intelligence
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Unclaimed Scholarships */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex flex-col items-start h-full">
                <h3 className="text-lg font-medium text-gray-400 mb-4">Unclaimed Scholarships Annually</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-orange-500">$100M</span>
                </div>
                <div className="mt-auto flex items-center justify-between w-full">
                  <span className="text-sm text-gray-400">Due to inefficient distribution systems</span>
                  <a 
                    href="https://www.forbes.com/sites/markcperna/2021/11/01/100-million-in-scholarship-money-goes-unclaimed-every-year-does-it-have-to"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    Forbes
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Out of School Children */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex flex-col items-start h-full">
                <h3 className="text-lg font-medium text-gray-400 mb-4">Children Out of School</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-orange-500">244M</span>
                </div>
                <div className="mt-auto flex items-center justify-between w-full">
                  <span className="text-sm text-gray-400">Due to lack of access to educational funding</span>
                  <a 
                    href="https://www.unesco.org/gem-report/en/articles/244m-children-wont-start-new-school-year"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    UNESCO
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* DeFi Adoption Challenge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex flex-col items-start h-full">
                <h3 className="text-lg font-medium text-gray-400 mb-4">DeFi Adoption Challenge</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-orange-500">Low Usage</span>
                </div>
                <div className="mt-auto flex items-center justify-between w-full">
                  <span className="text-sm text-gray-400">High brand recognition but limited active users</span>
                  <a 
                    href="https://www.coingecko.com/learn/defi-survey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    Coingecko
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-xl text-gray-300">
              Descholar bridges these gaps by making educational funding accessible and transparent through blockchain technology.
            </p>
          </motion.div>
        </section>

        {/* The Mission section - add id here */}
        <section id="mission" className="w-full max-w-6xl mx-auto px-8 pt-16 pb-24 bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-white">The Mission</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              By transforming global education funding through blockchain technology, we are building a future where every student has equal access to educational opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <FiGlobe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Global Reach</h3>
                  <p className="text-md text-gray-300">
                    Connect with educational opportunities worldwide through our decentralized platform, powered by Open Campus's global network.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <FiLock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Transparent & Secure</h3>
                  <p className="text-md text-gray-300">
                    Smart contracts ensure transparent fund management and automatic distribution, building trust through blockchain technology.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Easy Access</h3>
                  <p className="text-md text-gray-300">
                    Integration with Open Campus ID makes verification and funding accessible to over 615,000 verified students and educators.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <HiOutlineLightBulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Innovation</h3>
                  <p className="text-md text-gray-300">
                    Built on EDU Chain, the first Layer 3 blockchain specifically designed for education, offering specialized features for educational institutions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <p className="text-base text-gray-400">
              Join us in revolutionizing educational funding and creating equal opportunities for students worldwide.
            </p>
          </motion.div>
        </section>

        {/* Add this new section after The Mission section */}
        <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-24 mt-16 bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-white">What's In It For You</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Students Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-3">
                <span className="p-2 bg-orange-600 rounded-lg">
                  <FiGlobe className="w-5 h-5" />
                </span>
                For Students
              </h3>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Easy application for international scholarships",
                  "Receive funds directly in local currency",
                  "No complex wallet setup required",
                  "Track your applications in real-time",
                  "Secure and transparent process",
                  "Access global opportunities",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <HiCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link href="/scholarships">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  View Scholarships
                </button>
              </Link>
            </motion.div>

            {/* Donors Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-3">
                <span className="p-2 bg-orange-600 rounded-lg">
                  <FiDollarSign className="w-5 h-5" />
                </span>
                For Donors & Investors
              </h3>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Make a direct impact on students' lives",
                  "Full transparency through student ID verification",
                  "Efficient fund distribution",
                  "Track your impact in real-time",
                  "Low transaction costs",
                  "Global reach with local impact",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <HiCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link href="/addscholarship">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Create Scholarship
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      
    </div>
  );
}
