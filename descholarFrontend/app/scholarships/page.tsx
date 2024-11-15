"use client";
import { motion } from "framer-motion";

const Scholarships = () => {
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
            Available Scholarships
          </h1>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Browse and apply for scholarships from organizations and donors worldwide.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Example scholarship card - remove when implementing real data */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">
              STEM Excellence Scholarship
            </h2>
            <div className="space-y-3">
              <p className="text-gray-300 text-sm flex justify-between">
                <span>Amount:</span>
                <span className="text-orange-400 font-semibold">1000 XLM</span>
              </p>
              <p className="text-gray-300 text-sm flex justify-between">
                <span>Deadline:</span>
                <span>March 30, 2024</span>
              </p>
              <p className="text-gray-300 text-sm flex justify-between">
                <span>Available Grants:</span>
                <span>5</span>
              </p>
            </div>
            <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Apply Now
            </button>
          </motion.div>

          {/* Add more example cards here */}
        </motion.div>
      </main>
    </div>
  );
};

export default Scholarships;
