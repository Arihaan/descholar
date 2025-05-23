"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { useAccount } from "wagmi";
import Notification from '../components/Notification';
import { getReadableErrorMessage } from '../utils/errorMessages';
import { ethers } from "ethers";

const CreateScholarshipPage = () => {
  const [scholarship, setScholarship] = useState({
    name: "",
    creatorName: "",
    details: "",
    numberOfGrants: "",
    grantAmount: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState<{
    message: React.ReactNode;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });
  
  const { createScholarship, isInitialized } = useContractInteraction();
  const { address } = useAccount();

  // Add state for token selection
  const [useERC20, setUseERC20] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(false);

  // Add state for transaction result
  const [transactionResult, setTransactionResult] = useState<{ hash: string; url: string } | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setScholarship((prev) => ({
      ...prev,
      [name]:
        name === "numberOfGrants"
          ? value === ""
            ? ""
            : Math.max(1, parseInt(value) || 0)
          : name === "grantAmount"
          ? value
          : value,
    }));
  }

  // Add token validation function
  const validateToken = async (address: string) => {
    if (!address) return;
    setIsValidatingToken(true);
    try {
      const provider = new ethers.JsonRpcProvider("https://rpc.edu-chain.raas.gelato.cloud");
      const tokenContract = new ethers.Contract(
        address,
        ["function symbol() view returns (string)"],
        provider
      );
      const symbol = await tokenContract.symbol();
      setTokenSymbol(symbol);
      showNotification(`Token validated: ${symbol}`, 'success');
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      showNotification('Invalid token address', 'error');
      setTokenSymbol('');
      return false;
    } finally {
      setIsValidatingToken(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    if (!scholarship.name.trim()) {
      alert("Please enter a scholarship name");
      return;
    }

    if (!scholarship.details.trim()) {
      alert("Please enter scholarship details");
      return;
    }

    const numGrants = parseInt(scholarship.numberOfGrants);
    if (!numGrants || numGrants <= 0) {
      alert("Number of grants must be greater than 0");
      return;
    }

    const grantAmount = parseFloat(scholarship.grantAmount);
    if (isNaN(grantAmount) || grantAmount <= 0) {
      alert(`Grant amount must be greater than 0 ${useERC20 ? tokenSymbol || 'tokens' : 'EDU'}`);
      return;
    }

    const endDate = new Date(scholarship.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate < today) {
      alert("End date cannot be in the past");
      return;
    }

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    if (endDate > maxDate) {
      alert("End date cannot be more than 10 years in the future");
      return;
    }

    if (useERC20 && !tokenSymbol) {
      showNotification('Please validate the token address first', 'error');
      return;
    }

    setShowConfirmation(true);
  }

  async function handleConfirmCreate() {
    if (!isInitialized) {
        showNotification('Please wait for contract initialization', 'error');
        return;
    }

    try {
        setLoading(true);
        const endDate = new Date(scholarship.endDate);
        endDate.setHours(23, 59, 59, 999);

        const result = await createScholarship(
            scholarship.name,
            scholarship.creatorName,
            scholarship.details,
            scholarship.grantAmount,
            parseInt(scholarship.numberOfGrants),
            endDate,
            useERC20 ? tokenAddress : ethers.ZeroAddress
        );

        showNotification(
          <span>
            Scholarship created successfully! View transaction: {" "}
            <a 
              href={`https://educhain.blockscout.com/tx/${result.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {result.hash.slice(0, 8)}...{result.hash.slice(-6)}
            </a>
          </span>,
          'success'
        );

        setTimeout(() => {
            window.location.href = "/myactivity";
        }, 2000);
    } catch (error: any) {
        console.error("Error creating scholarship:", error);
        showNotification(
            getReadableErrorMessage(error),
            'error'
        );
    } finally {
        setLoading(false);
        setShowConfirmation(false);
    }
  }

  const showNotification = (message: React.ReactNode, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  useEffect(() => {
    if (notification.isVisible && notification.type === 'success' && transactionResult?.url) {
        const timer = setTimeout(() => {
            window.open(transactionResult.url, '_blank');
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [notification.isVisible, notification.type, transactionResult]);

  if (!address) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to create a scholarship</p>
          <w3m-button />
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative">
            <div className="text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Initializing</h2>
                <p className="text-gray-400">Please wait while we connect to the contract...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
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
            Create Scholarship
          </h1>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Create a new scholarship opportunity and make a difference in
            students' lives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2 text-sm">
                Scholarship Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={scholarship.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="creatorName"
                className="block text-white mb-2 text-sm"
              >
                Creator Name / Organization *
              </label>
              <input
                type="text"
                id="creatorName"
                name="creatorName"
                value={scholarship.creatorName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-white mb-2 text-sm"
              >
                Details *
              </label>
              <textarea
                id="details"
                name="details"
                value={scholarship.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm resize-y"
                required
              />
            </div>

            <div>
              <label
                htmlFor="numberOfGrants"
                className="block text-white mb-2 text-sm flex items-center justify-between"
              >
                <span>Number of Grants *</span>
              </label>
              <input
                type="number"
                id="numberOfGrants"
                name="numberOfGrants"
                value={scholarship.numberOfGrants}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>


            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useERC20"
                checked={useERC20}
                onChange={(e) => {
                  setUseERC20(e.target.checked);
                  if (!e.target.checked) {
                    setTokenAddress('');
                    setTokenSymbol('');
                  }
                }}
                className="rounded border-gray-700 bg-gray-800 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="useERC20" className="text-white">
                Use ERC20 Token Instead of EDU
              </label>
            </div>

            {useERC20 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mt-4"
              >
                <label className="text-white">Token Address</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter ERC20 token address"
                    className="w-full px-4 py-2 bg-gray-800 rounded-xl border border-gray-700 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => validateToken(tokenAddress)}
                    disabled={isValidatingToken || !tokenAddress}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-xl text-white transition-colors"
                  >
                    {isValidatingToken ? 'Validating...' : 'Validate'}
                  </button>
                </div>
                {tokenSymbol && (
                  <p className="text-green-400 text-sm">
                    Token Symbol: {tokenSymbol}
                  </p>
                )}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="grantAmount"
                className="block text-white mb-2 text-sm flex items-center justify-between"
              >
                <span>Grant Amount per Student ({useERC20 ? tokenSymbol || 'tokens' : 'EDU'}) *</span>
              </label>
              <input
                type="number"
                id="grantAmount"
                name="grantAmount"
                value={scholarship.grantAmount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-white mb-2 text-sm"
                >
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={scholarship.endDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Scholarship
            </button>
          </form>
        </motion.div>

        <AnimatePresence>
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
                <h2 className="text-2xl font-bold mb-6 text-white">Confirm Scholarship Creation</h2>
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Total Cost</h3>
                    <p className="text-orange-400 font-semibold">
                        {parseFloat(scholarship.grantAmount) * parseInt(scholarship.numberOfGrants)} {useERC20 ? tokenSymbol || 'tokens' : 'EDU'}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        ({scholarship.grantAmount} {useERC20 ? tokenSymbol || 'tokens' : 'EDU'} × {scholarship.numberOfGrants} grants)
                    </p>
                  </div>

                  <div className="bg-orange-900/30 border border-orange-700/50 p-4 rounded-xl">
                    <div className="flex items-start space-x-2">
                        <svg className="w-6 h-6 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-orange-200 font-medium">Important Notice</p>
                            <p className="text-orange-200/80 text-sm mt-1">
                                This will require a transaction to create the scholarship and deposit the total grant amount.
                                Make sure you have enough {useERC20 ? tokenSymbol || 'tokens' : 'EDU'} in your wallet.
                            </p>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCreate}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Confirm & Create"}
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

export default CreateScholarshipPage;
