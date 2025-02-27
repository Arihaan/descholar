"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle, FiShare2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { useAccount } from "wagmi";
import { getReadableErrorMessage } from '../utils/errorMessages';
import Notification from '../components/Notification';
import { ethers } from "ethers";
import { formatDateTime } from '../utils/dateFormat';
import { Scholarship } from '../types/scholarship';

interface Application {
  id: number;
  scholarshipId: number;
  name: string;
  details: string;
  status: string;
  appliedAt: Date;
  grantAmount: string;
  scholarship?: ScholarshipDetails;
}

interface ScholarshipDetails {
  name: string;
  grantAmount: string;
  isCancelled: boolean;
  cancellationReason: string;
  cancelledAt: Date | null;
  tokenSymbol: string;
  tokenId: string;
  tokenUrl: string;
}

interface CreatedScholarship extends Scholarship {
  remainingGrants: number;
  active: boolean;
  endDate: Date;
  isCancelled: boolean;
  cancellationReason: string;
  cancelledAt: Date | null;
}

interface ScholarshipApplication {
  id: number;
  scholarshipId: number;
  applicant: string;
  name: string;
  details: string;
  status: string;
  appliedAt: Date;
}

const getStatusInfo = (status: number) => {
  switch (status) {
    case 1:
      return {
        message: 'Approved - Funds Received!',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/20'
      };
    case 2:
      return {
        message: 'Rejected',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        borderColor: 'border-red-400/20'
      };
    case 0:
    default:
      return {
        message: 'Pending',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        borderColor: 'border-yellow-400/20'
      };
  }
};

const getStatusIcon = (status: string, isCancelled?: boolean) => {
  if (isCancelled) {
    return <FiXCircle className="w-5 h-5 mr-2 text-red-500" />;
  }
  switch (status) {
    case 'Applied':
      return <FiClock className="w-5 h-5 mr-2 text-yellow-500" />;
    case 'Approved':
      return <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />;
    case 'Rejected':
      return <FiXCircle className="w-5 h-5 mr-2 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string, isCancelled?: boolean) => {
  if (isCancelled) {
    return 'text-red-500';
  }
  switch (status) {
    case 'Applied':
      return 'text-yellow-500';
    case 'Approved':
      return 'text-green-500';
    case 'Rejected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const categorizeScholarships = (scholarships: CreatedScholarship[]) => {
  const now = new Date();
  return {
    live: scholarships.filter(s => 
      !s.isCancelled && 
      s.remainingGrants > 0 && 
      new Date(s.endDate) > now
    ),
    ended: scholarships.filter(s => 
      s.isCancelled || 
      s.remainingGrants === 0 || 
      new Date(s.endDate) <= now
    )
  };
};

const MyActivity = () => {
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [createdScholarships, setCreatedScholarships] = useState<CreatedScholarship[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewingScholarship, setReviewingScholarship] = useState<CreatedScholarship | null>(null);
  const [scholarshipApplications, setScholarshipApplications] = useState<ScholarshipApplication[]>([]);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedScholarshipForCancel, setSelectedScholarshipForCancel] = useState<CreatedScholarship | null>(null);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const { 
    getUserActivity, 
    getApplicationsForScholarship, 
    approveApplication,
    isInitialized,
    cancelScholarship,
    withdrawExpiredScholarship 
  } = useContractInteraction();
  const { address } = useAccount();

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const fetchUserActivity = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const data = await getUserActivity(address);
      setApplications(data.applications);
      setCreatedScholarships(data.scholarships);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && isInitialized) {
      fetchUserActivity();
    }
  }, [address, isInitialized]);

  const calculateTotalGrant = (scholarship: Scholarship) => {
    const amount = parseFloat(scholarship.grantAmount);
    const total = amount * scholarship.totalGrants;
    return total.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 6 
    });
  };

  const handleScholarshipClick = (scholarship: CreatedScholarship) => {
    // Close any other open modals first
    setSelectedApplication(null);
    setReviewingScholarship(null);
    setShowCancellationModal(false);
    
    // Then open the selected scholarship
    setSelectedScholarship(scholarship);
    fetchScholarshipApplications(scholarship.id);
  };

  const handleReviewScholarship = (scholarship: CreatedScholarship) => {
    // Close any other open modals first
    setSelectedApplication(null);
    setSelectedScholarship(null);
    setShowCancellationModal(false);
    
    // Then open the reviewing scholarship
    setReviewingScholarship(scholarship);
    fetchScholarshipApplications(scholarship.id);
  };

  const handleApplicationSelect = (application: Application) => {
    // Close any other open modals first
    setSelectedScholarship(null);
    setReviewingScholarship(null);
    setShowCancellationModal(false);
    
    // Then open the selected application
    setSelectedApplication(application);
  };

  const handleApproveApplication = async (scholarshipId: number, applicationId: number) => {
    try {
      setReviewLoading(true);
      await approveApplication(scholarshipId, applicationId);
      
      // Refresh both the applications list and the overall user activity
      await fetchScholarshipApplications(scholarshipId);
      await fetchUserActivity();
      
      showNotification('Application approved successfully!', 'success');
    } catch (error: any) {
      console.error('Error approving application:', error);
      showNotification(
        getReadableErrorMessage(error),
        'error'
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelClick = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedScholarship || !cancellationReason.trim()) return;
    try {
      const hash = await cancelScholarship(selectedScholarship.id, cancellationReason);
      showNotification(`Scholarship cancelled successfully! Transaction: ${hash}`, 'success');
      setShowCancelModal(false);
      setCancellationReason('');
      fetchUserActivity();
    } catch (error) {
      console.error('Error cancelling scholarship:', error);
      showNotification('Failed to cancel scholarship', 'error');
    }
  };

  const fetchScholarshipApplications = async (scholarshipId: number) => {
    try {
      setReviewLoading(true);
      console.log('Fetching applications for scholarship ID:', scholarshipId);
      const applications = await getApplicationsForScholarship(scholarshipId);
      console.log('Received applications:', applications);
      if (Array.isArray(applications)) {
        setScholarshipApplications(applications);
        setShowScholarshipModal(true);
      } else {
        console.error('Unexpected applications data format:', applications);
        setScholarshipApplications([]);
      }
    } catch (error) {
      console.error('Error fetching scholarship applications:', error);
      showNotification('Failed to load applications', 'error');
      setScholarshipApplications([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleShareScholarship = (scholarshipId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/scholarships/${scholarshipId}`;
    navigator.clipboard.writeText(url);
    showNotification('Link copied to clipboard!', 'success');
  };

  if (!address) {
    return (
      <div className="min-h-screen flex flex-col relative">
        {/* Keep the background */}
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
            <p className="text-center text-gray-300 mb-12">
              Please connect your wallet to view your activity
            </p>
          </motion.div>
        </main>
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

        {loading ? (
          <div className="text-center text-gray-300">Loading your activity...</div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Applications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold mb-6 text-white">My Applications</h2>
              {applications.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  You haven't applied to any scholarships yet
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div 
                      key={application.id} 
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleApplicationSelect(application)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {application.scholarship?.name}
                        </h3>
                        {(() => {
                          const statusInfo = getStatusInfo(parseInt(application.status));
                          return (
                            <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                              {statusInfo.message}
                            </span>
                          );
                        })()}
                      </div>
                      
                      <div className="mt-4 space-y-2 text-gray-300">
                        <p><span className="text-gray-400">Applied on:</span> {formatDateTime(application.appliedAt)}</p>
                        <p className="line-clamp-2"><span className="text-gray-400">Your Application:</span> {application.details}</p>
                      </div>

                      {/* Add a subtle indicator that the card is clickable */}
                      <div className="mt-4 text-sm text-gray-400 flex items-center">
                        <span>Click to view details</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Created Scholarships Section */}
            <div className="space-y-8">
              {/* Live Scholarships */}
              <div>
                <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Live Scholarships
                </h3>
                <div className="space-y-4">
                  {categorizeScholarships(createdScholarships).live.map((scholarship) => (
                    <motion.div
                      key={scholarship.id}
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleScholarshipClick(scholarship)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{scholarship.name}</h3>
                          <p className="text-sm text-gray-400">Creator: {scholarship.creatorName}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareScholarship(scholarship.id, e);
                          }}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Share scholarship"
                        >
                          <FiShare2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="mt-4 space-y-2 text-gray-300">
                        <p><span className="text-gray-400">Active</span></p>
                        <p className="line-clamp-2"><span className="text-gray-400">Click to view applicants</span></p>
                      </div>

                      {/* Grant Amount and Applicants Display in Card */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="flex items-baseline justify-center">
                            <span className="text-xl font-bold text-orange-400">
                              {calculateTotalGrant(scholarship)}
                            </span>
                            <span className="text-orange-400 ml-2">
                              {scholarship.tokenSymbol}
                            </span>
                          </div>
                          <div className="text-center text-sm text-gray-400 mt-1">
                            Total Grant Pool
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="text-center text-xl font-bold text-white">
                            {scholarship.totalGrants - scholarship.remainingGrants}
                          </div>
                          <div className="text-center text-sm text-gray-400 mt-1">
                            Total Applicants
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Ended Scholarships */}
              <div>
                <h3 className="text-xl font-medium text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  Ended Scholarships
                </h3>
                <div className="space-y-4">
                  {categorizeScholarships(createdScholarships).ended.map((scholarship) => (
                    <motion.div
                      key={scholarship.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl opacity-80 cursor-pointer"
                      onClick={() => {
                        handleReviewScholarship(scholarship);
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-white">{scholarship.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded-lg text-gray-400 mt-2">
                              ID: {scholarship.id}
                            </span>
                            <span className="text-sm text-gray-400 mt-2">
                              Click to view applicants
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-gray-300 text-sm flex justify-between">
                            <span>Total Grant Pool:</span>
                            <span className="text-orange-400 font-semibold">
                              {parseFloat(scholarship.grantAmount) * scholarship.totalGrants} {scholarship.tokenSymbol}
                            </span>
                          </p>
                          {scholarship.tokenId !== ethers.ZeroAddress && (
                            <a
                              href={scholarship.tokenUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-400 hover:text-orange-300 transition-colors block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Token: {scholarship.tokenId.slice(0, 6)}...{scholarship.tokenId.slice(-4)}
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        {scholarship.isCancelled ? (
                          <>
                            <span>Cancelled</span>
                            <span>
                              On: {scholarship.cancelledAt ? scholarship.cancelledAt.toLocaleDateString() : 'Unknown date'}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>All Grants Awarded</span>
                            <span>Ended: {scholarship.endDate.toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Details Modal */}
        <AnimatePresence>
          {selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setSelectedApplication(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-8 rounded-2xl max-w-2xl w-full mx-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-white">Application Details</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                  {/* Scholarship Info Card */}
                  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                    <a 
                      href={`/scholarships/${selectedApplication.scholarshipId}`}
                      className="text-2xl font-bold text-white hover:text-orange-300 transition-colors"
                    >
                      {selectedApplication.scholarship?.name}
                    </a>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-lg text-gray-300">
                        Application ID: {selectedApplication.id}
                      </span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-lg text-gray-300">
                        Scholarship ID: {selectedApplication.scholarshipId}
                      </span>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Status</h3>
                      {(() => {
                        const statusInfo = getStatusInfo(parseInt(selectedApplication.status));
                        return (
                          <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                            {statusInfo.message}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Applied on: {formatDateTime(selectedApplication.appliedAt)}
                    </p>
                  </div>

                  {/* Grant Details Card */}
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Grant Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-orange-400 font-semibold">
                          {selectedApplication.scholarship?.grantAmount} {selectedApplication.scholarship?.tokenSymbol}
                        </span>
                      </div>
                      {selectedApplication?.scholarship?.tokenId !== ethers.ZeroAddress && (
                        <div className="pt-2 border-t border-gray-700">
                          <a
                            href={selectedApplication.scholarship?.tokenUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            View Token Contract
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Application Details Card */}
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Application</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedApplication.details}</p>
                  </div>

                  {/* Cancellation Notice Card (if applicable) */}
                  {selectedApplication.scholarship?.isCancelled && (
                    <div className="bg-red-900/30 p-6 rounded-xl border border-red-700/50">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/20 rounded-full">
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Scholarship Cancelled</h3>
                          <p className="text-red-200/80 mb-2">
                            {selectedApplication.scholarship.cancellationReason}
                          </p>
                          <p className="text-red-300/60 text-sm">
                            Cancelled on: {selectedApplication.scholarship.cancelledAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      setSelectedScholarship(null);
                      setShowScholarshipModal(false);
                      setScholarshipApplications([]);
                    }}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add Cancellation Modal */}
          {showCancellationModal && selectedScholarshipForCancel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
              onClick={() => setShowCancellationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-gray-900 p-6 rounded-xl max-w-md w-full border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Cancel Scholarship</h3>
                <p className="text-gray-300 mb-4">
                  Are you sure you want to cancel this scholarship? This action cannot be undone.
                </p>
                <input
                  type="text"
                  placeholder="Enter reason for cancellation"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCancellationModal(false);
                      setCancellationReason('');
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={!cancellationReason.trim()}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {showScholarshipModal && selectedScholarship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => {
              setSelectedScholarship(null);
              setShowScholarshipModal(false);
              setScholarshipApplications([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 p-8 rounded-2xl w-full max-w-4xl mx-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <a 
                    href={`/scholarships/${selectedScholarship.id}`}
                    className="text-2xl font-bold text-white hover:text-orange-300 transition-colors"
                  >
                    {selectedScholarship.name}
                  </a>
                  <span className="text-sm bg-gray-800 px-2 py-1 rounded-lg text-gray-400 mt-2 inline-block">
                    Scholarship ID: {selectedScholarship.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareScholarship(selectedScholarship.id, e);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                    title="Share scholarship"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScholarship(null);
                      setShowScholarshipModal(false);
                      setScholarshipApplications([]);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Applications</h3>
                  {!selectedScholarship.isCancelled && new Date() <= selectedScholarship.endDate && (
                    <button
                      onClick={() => setShowCancellationModal(true)}
                      className="px-3 py-1 bg-red-400/10 text-red-400 rounded-lg border border-red-400/20 hover:bg-red-400/20 transition-colors"
                    >
                      Cancel Scholarship
                    </button>
                  )}
                </div>

                {scholarshipApplications.map((application) => (
                  <div
                    key={application.id}
                    className="bg-gray-800 p-6 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold">{application.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded-lg text-gray-300">
                            Application ID: {application.id}
                          </span>
                          <p className="text-sm text-gray-400">
                            Applied: {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {/* Only show status for non-cancelled scholarships or if already approved */}
                      {(!selectedScholarship.isCancelled || application.status === 'Approved') && (
                        <div className={`flex items-center ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span>{application.status}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300">{application.details}</p>
                    {/* Only show approve button if scholarship is not cancelled and application is pending */}
                    {application.status === 'Applied' && !selectedScholarship.isCancelled && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleApproveApplication(selectedScholarship.id, application.id)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl"
                        >
                          Approve Application
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Review Applications Modal */}
        {reviewingScholarship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setReviewingScholarship(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 p-8 rounded-2xl max-w-4xl w-full mx-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <a 
                    href={`/scholarships/${reviewingScholarship.id}`}
                    className="text-2xl font-bold text-white hover:text-orange-300 transition-colors"
                  >
                    {reviewingScholarship.name}
                  </a>
                  <span className="text-sm bg-gray-800 px-2 py-1 rounded-lg text-gray-400 mt-2 inline-block">
                    Scholarship ID: {reviewingScholarship.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareScholarship(reviewingScholarship.id, e);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                    title="Share scholarship"
                  >
                    <FiShare2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScholarship(null);
                      setShowScholarshipModal(false);
                      setScholarshipApplications([]);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Add cancellation notice at the top if cancelled */}
              {reviewingScholarship.isCancelled && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
                  <p className="text-red-300 font-medium">This scholarship has been cancelled</p>
                  <p className="text-red-200/80 text-sm mt-1">
                    Reason: {reviewingScholarship.cancellationReason}
                  </p>
                  <p className="text-red-400/60 text-xs mt-1">
                    Cancelled on: {reviewingScholarship.cancelledAt ? 
                      reviewingScholarship.cancelledAt.toLocaleDateString() : 
                      'Unknown date'
                    }
                  </p>
                </div>
              )}

              {reviewLoading ? (
                <div className="text-center text-gray-300">Loading applications...</div>
              ) : scholarshipApplications.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No applications received yet</div>
              ) : (
                <div className="space-y-4">
                  {scholarshipApplications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-gray-800 p-6 rounded-xl space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold">{application.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded-lg text-gray-300">
                              Application ID: {application.id}
                            </span>
                            <p className="text-sm text-gray-400">
                              Applied: {new Date(application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {/* Only show status for non-cancelled scholarships or if already approved */}
                        {(!reviewingScholarship.isCancelled || application.status === 'Approved') && (
                          <div className={`flex items-center ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span>{application.status}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300">{application.details}</p>
                      {/* Only show approve button if scholarship is not cancelled and application is pending */}
                      {application.status === 'Applied' && !reviewingScholarship.isCancelled && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleApproveApplication(reviewingScholarship.id, application.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl"
                            disabled={reviewLoading}
                          >
                            Approve Application
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyActivity;
