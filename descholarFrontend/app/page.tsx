"use client";
import Link from "next/link";
import RotatingTypewriter from "./components/RotatingTypewriter";
import { motion } from "framer-motion";
import { FiGlobe, FiLock, FiDollarSign } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import CountUp from 'react-countup';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const marketData = [
  { year: '2020', value: 3.2 },
  { year: '2021', value: 3.4 },
  { year: '2022', value: 3.6 },
  { year: '2023', value: 3.8 },
  { year: '2024', value: 4.0 },
];

const scholarshipData = [
  { category: 'Unclaimed', value: 100 },
  { category: 'Claimed', value: 900 },
];

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
        <div className="w-full max-w-7xl mx-auto px-6 mb-24 mt-32">
          {/* Centered heading section */}
          <div className="text-center mb-16">
            <h1 className="text-7xl md:text-9xl font-['TT_Barrels'] tracking-tight"
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
              <p className="text-xl md:text-1xl text-gray-200 leading-relaxed mb-12">
                Empowering education globally with secure, decentralized scholarships and student loans (coming soon)
                <span className="block mt-4">
                  Learn more about Descholar's mission and how it can help you.
                </span>
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
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
                <img 
                  src="/resources/stellar-logo.svg" 
                  alt="Stellar Logo" 
                  className="h-12 w-auto"
                />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {/* Market Size Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">Global Student Loan Market</h3>
              <div className="text-4xl font-bold text-orange-500 mb-4">
                $<CountUp end={3.8} decimals={1} duration={2.5} /> Trillion
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f97316" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Scholarship Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl"
            >
              <h3 className="text-2xl font-semibold mb-4 text-white">Annual Scholarship Distribution</h3>
              <div className="text-4xl font-bold text-orange-500 mb-4">
                $<CountUp end={100} duration={2.5} /> Million
              </div>
              <p className="text-gray-300 mb-6">in scholarships go unclaimed every year</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scholarshipData}>
                    <XAxis dataKey="category" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="value" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
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
              Descholar aims to bring a piece of this massive market onchain.
            </p>
          </motion.div>
        </section>

        {/* The Mission section */}
        <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-24 bg-gray-900 bg-opacity-40 backdrop-blur-sm rounded-3xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 text-white">The Mission</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming global education funding through blockchain technology. We're building a future where every student has equal access to educational opportunities.
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
                  <p className="text-gray-300">
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
                  <p className="text-gray-300">
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
                  <p className="text-gray-300">
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
                  <p className="text-gray-300">
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
            <p className="text-gray-400 text-lg">
              Join us in revolutionizing educational funding and creating equal opportunities for students worldwide.
            </p>
          </motion.div>
        </section>

        
      </main>

      
    </div>
  );
}
