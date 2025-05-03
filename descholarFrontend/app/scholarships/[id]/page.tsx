"use client";
import { useEffect, useState } from 'react';
import { useContractInteraction } from '../../hooks/useContractInteraction';
import { Scholarship } from '../../types/scholarship';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatDateTime } from '../../utils/dateFormat';
import { useForm } from 'react-hook-form';
import Notification from '../../components/Notification';
import { getReadableErrorMessage } from '../../utils/errorMessages';
import { FiShare2 } from 'react-icons/fi';
import { ethers } from 'ethers';
import { useParams } from 'next/navigation';

export default function ScholarshipPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { getScholarships, applyForScholarship, checkHasApplied } = useContractInteraction();
  const { address } = useAccount();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false,
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [applicationData, setApplicationData] = useState<{
    name: string;
    details: string;
  } | null>(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setLoading(true);
        const scholarships = await getScholarships();
        const found = scholarships.find(s => s.id === parseInt(id));
        if (found) {
          setScholarship(found);
          if (address) {
            const applied = await checkHasApplied(found.id, address);
            setHasApplied(applied);
          }
        }
      } catch (error) {
        console.error('Error fetching scholarship:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id, address]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const handleApplicationSubmit = (data: any) => {
    setApplicationData(data);
    setShowReviewModal(true);
  };

  const handleApply = async () => {
    if (!address || !scholarship || !applicationData) return;

    try {
      setApplying(true);
      await applyForScholarship(
        scholarship.id,
        applicationData.name,
        applicationData.details
      );
      showNotification('Application submitted successfully!', 'success');
      setHasApplied(true);
      setShowReviewModal(false);
    } catch (error: any) {
      console.error('Error applying:', error);
      showNotification(getReadableErrorMessage(error), 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Link copied to clipboard!', 'success');
  };

  const isFormValid = () => {
    const nameValue = watch("name", "");
    const detailsValue = watch("details", "");
    return nameValue.length >= 2 && detailsValue.length >= 10;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Loading scholarship details...</p>
    </div>;
  }

  if (!scholarship) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Scholarship not found</p>
    </div>;
  }

  const isExpired = new Date() > scholarship.endDate;
  const noGrantsLeft = scholarship.remainingGrants === 0;

  const watchName = watch("name", "");
  const watchDetails = watch("details", "");

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-0 bg-no-repeat w-full"
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

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">{scholarship.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg text-gray-400">
                      ID: {scholarship.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      Created: {formatDateTime(scholarship.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Share scholarship"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              {/* Scholarship details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-orange-400">
                        {scholarship.grantAmount}
                      </span>
                      <span className="text-orange-400 ml-2">
                        {scholarship.tokenSymbol}
                      </span>
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-1">
                      Grant Amount
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-center text-2xl font-bold text-white">
                      {scholarship.remainingGrants}/{scholarship.totalGrants}
                    </div>
                    <div className="text-center text-sm text-gray-400 mt-1">
                      Remaining Grants
                    </div>
                  </div>
                </div>

                {/* Token and Creator Info */}
                <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Creator:</span>
                    <div className="flex flex-col items-end">
                      <a
                        href={scholarship.creatorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-md"
                      >
                        {scholarship.creatorName}
                      </a>
                    </div>
                  </div>
                  {scholarship.tokenId !== "0x0000000000000000000000000000000000000000" && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Token Contract:</span>
                      <a
                        href={scholarship.tokenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        {scholarship.tokenId.slice(0, 6)}...{scholarship.tokenId.slice(-4)}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">End Date:</span>
                    <span className="text-gray-300 text-md">
                      {formatDateTime(scholarship.endDate)}
                    </span>
                  </div>
                </div>

                {/* Description section with heading */}
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-3">Description</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{scholarship.details}</p>
                </div>

                {/* Separator */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-900 px-3 text-sm text-gray-500">Application</span>
                  </div>
                </div>

                {/* Status messages */}
                {(isExpired || noGrantsLeft || scholarship.isCancelled) && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-300">
                    {scholarship.isCancelled && (
                      <>
                        <p className="font-medium">This scholarship has been cancelled</p>
                        <p className="text-sm mt-1">{scholarship.cancellationReason}</p>
                      </>
                    )}
                    {isExpired && !scholarship.isCancelled && (
                      <p>This scholarship has expired</p>
                    )}
                    {noGrantsLeft && !scholarship.isCancelled && !isExpired && (
                      <p>All grants have been awarded</p>
                    )}
                  </div>
                )}

                {/* Application form */}
                {!isExpired && !noGrantsLeft && !scholarship.isCancelled && !hasApplied && (
                  <form onSubmit={handleSubmit(handleApplicationSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        {...register("name", { 
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters"
                          }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                        placeholder="Enter your name (min. 2 characters)"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mt-1">{errors.name.message as string}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Application Details
                      </label>
                      <textarea
                        {...register("details", {
                          required: "Application details are required",
                          minLength: {
                            value: 10,
                            message: "Please provide at least 10 characters"
                          }
                        })}
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white h-32"
                        placeholder="Why should you be awarded this grant? (min. 10 characters)"
                      />
                      {errors.details && (
                        <p className="text-red-400 text-sm mt-1">{errors.details.message as string}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!isFormValid()}
                      className={`w-full px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-200 ${
                        !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Review Application
                    </button>
                  </form>
                )}

                {hasApplied && (
                  <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-green-300">
                    <p>You have already applied for this scholarship</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Add the Review Modal */}
      {showReviewModal && applicationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-auto border border-gray-700 my-8">
            <h2 className="text-2xl font-bold text-white mb-6">Review Your Application</h2>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Scholarship</h3>
                <p className="text-gray-300">{scholarship.name}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Grant Amount: {scholarship.grantAmount} {scholarship.tokenSymbol}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Your Name</h3>
                <p className="text-gray-300">{applicationData.name}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Your Application</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{applicationData.details}</p>
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
                    <p className="text-orange-200 font-medium">
                      Transaction Notice
                    </p>
                    <p className="text-orange-200/80 text-sm mt-1">
                      You'll need some EDU tokens to sign this
                      transaction. This is only for gas fees and won't
                      affect your application.
                    </p>
                    <a
                      href="https://yuzu.educhain.xyz/edu-faucet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Get EDU tokens for gas
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
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
              >
                Edit Application
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 