"use client";
import { motion } from "framer-motion";
import { Client, networks, Scholarship } from "bindings";
import { useState, useEffect } from "react";
import { scValToNative, Address } from 'stellar-sdk';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org/",
  });

  useEffect(() => {

    const fetchScholarships = async () => {
      try {
        const transaction = await scholarshipContract.get_scholarships();
        console.log("transaction:", transaction);
        if (transaction.simulation?.result?.retval) {
          console.log('Raw result:', transaction.result);
          var result = transaction.result;
          setScholarships(result);
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        setError("Failed to load scholarships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

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
            Browse and apply for scholarships from organizations worldwide.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-300">Loading scholarships...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {scholarships.map((scholarship, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">
                  {scholarship.name}
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm flex justify-between">
                    <span>Amount:</span>
                    <span className="text-orange-400 font-semibold">
                      {Number(scholarship.total_grant_amount) / 10000000} XLM
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm flex justify-between">
                    <span>Available Grants:</span>
                    <span>{scholarship.available_grants}</span>
                  </p>
                  <p className="text-gray-300 text-sm flex justify-between">
                    <span>End Date:</span>
                    <span>{new Date(Number(scholarship.end_date) * 1000).toLocaleDateString()}</span>
                  </p>
                  <p className="text-gray-300 text-sm mt-4">
                    {scholarship.details}
                  </p>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Scholarships;
