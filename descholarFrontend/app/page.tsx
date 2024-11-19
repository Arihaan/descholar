"use client";
import Link from "next/link";
import RotatingTypewriter from "./components/RotatingTypewriter";
import { motion } from "framer-motion";
import { FiGlobe, FiLock, FiDollarSign } from "react-icons/fi";
import { HiOutlineLightBulb, HiCheck } from "react-icons/hi";
import CountUp from 'react-countup';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const scholarshipData = [
  { category: 'Unclaimed', value: 100 },
  { category: 'Claimed', value: 900 },
];

const outOfSchoolData = [
  { name: 'Out of School', value: 244 },
  { name: 'In School', value: 1156 }, // Approximate total school-age population
];

const defiAdoptionData = [
  { name: 'Brand Awareness', value: 85 },
  { name: 'Active Usage', value: 15 },
];

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
            <h1 className="text-6xl md:text-[120px] font-['TT_Barrels'] tracking-tight"
                style={{
                  color: '#f2f2f2',
                  textShadow: '6px 6px 0px #733932'
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
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-12">
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
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-8">
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
                <span className="text-gray-300">Powered by</span>
                <a 
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
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">Growing yearly with increasing education costs</span>
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
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">Due to inefficient distribution systems</span>
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
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">Source: UNESCO Education Data</span>
                </div>
              </div>
            </motion.div>

            {/* DeFi Adoption Challenge - Updated to match other cards */}
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
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">
                    High brand recognition but limited active users in DeFi protocols
                  </span>
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
            {/* Key Feature Cards */}
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
                    Connect with educational opportunities worldwide through our decentralized platform, powered by Stellar's global network.
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
                  <p className="text-sm text-gray-300">
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
                  <p className="text-sm text-gray-300">
                    Simple passkey authentication and integration with local currency off-ramps make funding accessible to everyone.
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
                  <p className="text-sm text-gray-300">
                    Built on Stellar Soroban, offering fast, low-cost transactions and automated smart contract functionality.
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
