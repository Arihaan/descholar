"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { useAccount } from "wagmi";
import Notification from '../components/Notification';
import { getReadableErrorMessage } from '../utils/errorMessages';
import { ethers } from "ethers";
import { Scholarship } from '../types/scholarship';
import { formatDateTime } from '../utils/dateFormat';
import { FiShare2, FiX } from 'react-icons/fi';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    details: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { address } = useAccount();
  const [hasAppliedToScholarship, setHasAppliedToScholarship] = useState<{ [key: number]: boolean }>({});

  const { 
    getScholarships, 
    applyForScholarship, 
    isInitialized,
    checkHasApplied
  } = useContractInteraction();

  useEffect(() => {
    if (isInitialized) {
      fetchScholarships();
    }
  }, [isInitialized]);

  const isScholarshipActive = (scholarship: any) => {
    const now = new Date();
    return (
      scholarship.active && 
      !scholarship.isCancelled && 
      scholarship.remainingGrants > 0 && 
      new Date(scholarship.endDate) > now
    );
  };

  const fetchScholarships = async () => {
    try {
      console.log("Starting to fetch scholarships");
      setLoading(true);
      const allScholarships = await getScholarships();
      const activeScholarships = allScholarships.filter(isScholarshipActive);
      setScholarships(activeScholarships);
    } catch (err) {
      console.error("Error in fetchScholarships:", err);
      setError("Failed to load scholarships. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Scholarships state updated:", scholarships);
  }, [scholarships]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await applyForScholarship(
        selectedScholarship!.id,
        applicationForm.name,
        applicationForm.details
      );
      showNotification("Application submitted successfully!", "success");
      setShowConfirmation(false);
      setIsApplying(false);
      setSelectedScholarship(null);
      setApplicationForm({ name: "", details: "" });
    } catch (err: any) {
      showNotification(
        getReadableErrorMessage(err),
        'error'
      );
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

  const handleApplyClick = (scholarship: Scholarship) => {
    if (!address) {
      setShowConnectPrompt(true);
      setSelectedScholarship(scholarship);
      return;
    }

    if (hasAppliedToScholarship[scholarship.id]) {
      return; // Do nothing if already applied
    }

    setSelectedScholarship(scholarship);
    setIsApplying(true);
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      scholarship.name.toLowerCase().includes(searchLower) ||
      scholarship.id.toString().includes(searchLower) ||
      scholarship.creatorName.toLowerCase().includes(searchLower)
    );
  });

  const handleScholarshipSelect = async (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    if (address) {
      try {
        const hasApplied = await checkHasApplied(scholarship.id, address);
        setHasAppliedToScholarship(prev => ({
          ...prev,
          [scholarship.id]: hasApplied
        }));
      } catch (error) {
        console.error('Error checking application status:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      {/* Background with overlay */}
      <div
        className="fixed inset-0 z-0 bg-no-repeat w-full"
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
          <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse and apply for scholarships from organizations worldwide.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by scholarship name, creator or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-gray-900 bg-opacity-40 backdrop-blur-sm text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-300">
            Fetching scholarships from the blockchain...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center text-gray-300">
            {searchTerm ? "No scholarships found matching your search" : "No scholarships found"}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredScholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                onClick={() => handleScholarshipSelect(scholarship)}
              >
                <div className="flex flex-col">
                  {/* Title */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{scholarship.name}</h3>
                    {/* Share button */}
                  </div>
                  <p className="text-gray-400 text-md mb-4">
                    Created by: {scholarship.creatorName}
                  </p>
                  
                  {/* Grant Amount */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-orange-400">
                        {scholarship.grantAmount}
                      </span>
                      <span className="text-orange-400 ml-2">
                        {scholarship.tokenSymbol}
                      </span>
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-2">
                      Grant Amount
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {scholarship.remainingGrants} / {scholarship.totalGrants}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDateTime(scholarship.endDate)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Connect Wallet Prompt Modal */}
        <AnimatePresence>
          {showConnectPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
              onClick={() => setShowConnectPrompt(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-8 rounded-2xl max-w-md w-full mx-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-300 mb-6">
                  Please connect your wallet to apply for this scholarship.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConnectPrompt(false)}
                    className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <w3m-button />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Scholarship Details Modal */}
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
                className="bg-gray-900 p-6 rounded-2xl max-w-4xl w-full mx-auto border border-gray-700 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedScholarship.name}</h2>
                    <span className="text-sm bg-gray-800 px-2 py-1 rounded-lg text-gray-400 mt-2 inline-block">
                      Scholarship ID: {selectedScholarship.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/scholarships/${selectedScholarship.id}`);
                        showNotification('Link copied to clipboard!', 'success');
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                      title="Share scholarship"
                    >
                      <FiShare2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedScholarship(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Left column */}
                  <div className="space-y-4">
                    {/* Grant Details Card */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <h3 className="text-md font-semibold text-white mb-3">Grant Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-orange-400 font-semibold">
                            {selectedScholarship.grantAmount} {selectedScholarship.tokenSymbol}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Available:</span>
                          <span className="text-white">
                            {selectedScholarship.remainingGrants} / {selectedScholarship.totalGrants}
                          </span>
                        </div>
                        {selectedScholarship.tokenId !== ethers.ZeroAddress && (
                          <div className="pt-2 border-t border-gray-700">
                            <a
                              href={selectedScholarship.tokenUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              View ERC20 Token Contract
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <h3 className="text-md font-semibold text-white mb-3">Timeline</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Created:</span>
                          <span className="text-gray-300">{formatDateTime(selectedScholarship.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Ends:</span>
                          <span className="text-gray-300">{formatDateTime(selectedScholarship.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Creator Info Card */}
                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                      <h3 className="text-md font-semibold text-white mb-3">Creator</h3>
                      <a
                        href={selectedScholarship.creatorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-md break-all"
                      >
                        {selectedScholarship.creatorName}
                      </a>
                    </div>
                  </div>

                  {/* Right column - Description */}
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 h-full">
                    <h3 className="text-md font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedScholarship.details}</p>
                  </div>
                </div>

                {/* Inside the Scholarship Details Modal */}
                <div className="flex justify-end mt-6">
                  {!hasAppliedToScholarship[selectedScholarship.id] && (
                    <button
                      onClick={() => {
                        if (!address) {
                          setShowConnectPrompt(true);
                        } else {
                          setIsApplying(true);
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl"
                    >
                      Apply for Grant
                    </button>
                  )}
                  {hasAppliedToScholarship[selectedScholarship.id] && (
                    <span className="text-green-500">Already Applied</span>
                  )}
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
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Application Form
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={applicationForm.name}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-xl border ${
                        applicationForm.name.trim().length < 2 &&
                        applicationForm.name.length > 0
                          ? "border-red-500"
                          : "border-gray-700"
                      }`}
                      placeholder="Enter your name (min. 2 characters)"
                    />
                    {applicationForm.name.trim().length < 2 &&
                      applicationForm.name.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          Name must be at least 2 characters long
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Application Details{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={applicationForm.details}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          details: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2 bg-gray-800 text-white rounded-xl border ${
                        applicationForm.details.trim().length < 10 &&
                        applicationForm.details.length > 0
                          ? "border-red-500"
                          : "border-gray-700"
                      } h-32`}
                      placeholder="Why should you be considered for this scholarship? (min. 10 characters)"
                    />
                    {applicationForm.details.trim().length < 10 &&
                      applicationForm.details.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          Details must be at least 10 characters long
                        </p>
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
                        !isFormValid()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-xl transform hover:-translate-y-1"
                      }`}
                      disabled={!isFormValid()}
                    >
                      Review Application
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm text-center mt-4">
                    All fields marked with{" "}
                    <span className="text-red-500">*</span> are required
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
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Review Your Application
                </h2>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-white font-medium mb-2">Scholarship</h3>
                    <p className="text-gray-300">{selectedScholarship?.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Grant Amount: {selectedScholarship?.grantAmount} {selectedScholarship?.tokenSymbol}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-white font-medium mb-2">Your Name</h3>
                    <p className="text-gray-300">{applicationForm.name}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-white font-medium mb-2">Your Application</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{applicationForm.details}</p>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0"
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
                        <p className="text-orange-200 font-medium">
                          Transaction Notice
                        </p>
                        <p className="text-orange-200/80 text-sm mt-1">
                          You'll need some testnet EDU tokens to sign this
                          transaction. This is only for gas fees and won't
                          affect your application.
                        </p>
                        <a
                          href="https://drpc.org/faucet/open-campus-codex"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          Get testnet EDU tokens from the dRPC faucet
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
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                  >
                    Edit Application
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Confirm & Submit"}
                  </button>
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
