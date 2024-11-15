"use client";
import { motion } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

const MyActivity = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with overlay */}
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
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(16, 8, 30, 0) 0%, rgba(16, 8, 30, 0.8) 50%, rgba(16, 8, 30, 1) 100%)',
          pointerEvents: 'none'
        }}></div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-8 text-center text-white">
            My Activity
          </h1>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Track your scholarship applications and manage your educational funding journey.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Applications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white">My Applications</h2>
            <div className="space-y-4">
              {/* Pending Application */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">STEM Excellence Scholarship</h3>
                    <p className="text-sm text-gray-300">Applied on: March 15, 2024</p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <FiClock className="w-5 h-5 mr-2" />
                    <span className="text-sm">Pending Review</span>
                  </div>
                </div>
              </motion.div>

              {/* Approved Application */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Global Education Fund</h3>
                    <p className="text-sm text-gray-300">Applied on: February 28, 2024</p>
                  </div>
                  <div className="flex items-center text-green-500">
                    <FiCheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Approved</span>
                  </div>
                </div>
              </motion.div>

              {/* Rejected Application */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Tech Innovation Grant</h3>
                    <p className="text-sm text-gray-300">Applied on: January 15, 2024</p>
                  </div>
                  <div className="flex items-center text-red-500">
                    <FiXCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Not Selected</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Created Scholarships Section (if user is a donor) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-white">Created Scholarships</h2>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Future Leaders Scholarship</h3>
                  <span className="text-sm text-orange-400 font-semibold">1000 XLM</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>5 Applications Pending</span>
                  <span>Ends: April 30, 2024</span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Review Applications
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MyActivity;
