"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { useAccount } from "wagmi";

interface Scholarship {
  id: number;
  name: string;
  details: string;
  grantAmount: string;
  remainingGrants: number;
  totalGrants: number;
  endDate: Date;
  creator: string;
  active: boolean;
  createdAt: Date;
}

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    details: ""
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { getScholarships, applyForScholarship, isInitialized } = useContractInteraction();
  const { address } = useAccount();

  useEffect(() => {
    if (isInitialized) {
      console.log('Contract initialized, fetching scholarships...');
      fetchScholarships();
    }
  }, [isInitialized]);

  const fetchScholarships = async () => {
    try {
      console.log('Starting to fetch scholarships');
      setLoading(true);
      const data = await getScholarships();
      console.log('Fetched scholarships data:', data);
      setScholarships(data);
    } catch (err) {
      console.error('Error in fetchScholarships:', err);
      setError("Failed to load scholarships. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Scholarships state updated:', scholarships);
  }, [scholarships]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await applyForScholarship(
        selectedScholarship!.id,
        applicationForm.name,
        applicationForm.details
      );
      setShowConfirmation(false);
      setIsApplying(false);
      setSelectedScholarship(null);
      setApplicationForm({ name: "", details: "" });
      alert("Application submitted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      applicationForm.name.trim().length >= 2 && // At least 2 characters for name
      applicationForm.details.trim().length >= 10 // At least 10 characters for details
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat w-full"
        style={{
          backgroundImage: 'url("/resources/webpagebg.png")',
          backgroundSize: "100% auto",
          backgroundColor: "#10081e",
          backgroundPosition: "top center",
          maxWidth: "100vw",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(16, 8, 30, 0) 0%, rgba(16, 8, 30, 0.8) 50%, rgba(16, 8, 30, 1) 100%)",
            pointerEvents: "none",
          }}
        ></div>
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
          <div className="text-center text-gray-300">
            Fetching scholarships from the blockchain...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : scholarships.length === 0 ? (
          <div className="text-center text-gray-300">
            No scholarships found
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {scholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl cursor-pointer"
                onClick={() => setSelectedScholarship(scholarship)}
              >
                <h2 className="text-xl font-semibold mb-4 text-white">
                  {scholarship.name}
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm flex justify-between">
                    <span>Grant Amount:</span>
                    <span className="text-orange-400 font-semibold">
                      {scholarship.grantAmount} EDU
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm flex justify-between">
                    <span>Available Grants:</span>
                    <span>{scholarship.remainingGrants} / {scholarship.totalGrants}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Scholarship Details Modal */}
        <AnimatePresence>
          {selectedScholarship && !isApplying && !showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedScholarship(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-white">{selectedScholarship.name}</h2>
                <div className="space-y-4">
                  <p className="text-gray-300">{selectedScholarship.details}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-gray-300">
                      <p className="font-semibold">Grant Amount</p>
                      <p className="text-orange-400">{selectedScholarship.grantAmount} EDU</p>
                    </div>
                    <div className="text-gray-300">
                      <p className="font-semibold">Available Grants</p>
                      <p>{selectedScholarship.remainingGrants} / {selectedScholarship.totalGrants}</p>
                    </div>
                    <div className="text-gray-300">
                      <p className="font-semibold">End Date</p>
                      <p>{selectedScholarship.endDate.toLocaleDateString()}</p>
                    </div>
                    <div className="text-gray-300">
                      <p className="font-semibold">Created</p>
                      <p>{selectedScholarship.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsApplying(true)}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-xl"
                    disabled={!address}
                  >
                    {address ? "Apply Now" : "Connect Wallet to Apply"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Application Form Modal */}
          {isApplying && !showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Application Form</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicationForm.name}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-xl border ${
                        applicationForm.name.trim().length < 2 && applicationForm.name.length > 0
                          ? 'border-red-500'
                          : 'border-gray-700'
                      }`}
                      placeholder="Enter your full name (min. 2 characters)"
                    />
                    {applicationForm.name.trim().length < 2 && applicationForm.name.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">Name must be at least 2 characters long</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Application Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={applicationForm.details}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, details: e.target.value }))}
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-xl border ${
                        applicationForm.details.trim().length < 10 && applicationForm.details.length > 0
                          ? 'border-red-500'
                          : 'border-gray-700'
                      } h-32`}
                      placeholder="Why should you be considered for this scholarship? (min. 10 characters)"
                    />
                    {applicationForm.details.trim().length < 10 && applicationForm.details.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">Details must be at least 10 characters long</p>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setIsApplying(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setShowConfirmation(true)}
                      className={`flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl transition-all duration-200 ${
                        !isFormValid() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                      disabled={!isFormValid()}
                    >
                      Review Application
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm text-center mt-4">
                    All fields marked with <span className="text-red-500">*</span> are required
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Confirmation Modal */}
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Confirm Application</h2>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Scholarship</h3>
                    <p className="text-gray-300">{selectedScholarship?.name}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Your Name</h3>
                    <p className="text-gray-300">{applicationForm.name}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Your Application</h3>
                    <p className="text-gray-300">{applicationForm.details}</p>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <svg 
                        className="w-6 h-6 text-orange-500 mt-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-orange-200 font-medium">Transaction Notice</p>
                        <p className="text-orange-200/80 text-sm mt-1">
                          You'll need some testnet EDU tokens to sign this transaction. This is only for gas fees and won't affect your application.
                        </p>
                        <a 
                          href="https://drpc.org/faucet/open-campus-codex"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <span>Get testnet EDU tokens from the dRPC faucet</span>
                          <svg 
                            className="w-4 h-4 ml-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth="2" 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Confirm & Submit"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Scholarships;
