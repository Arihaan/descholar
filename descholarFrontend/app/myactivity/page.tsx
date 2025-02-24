"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
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

interface CreatedScholarship {
  id: number;
  name: string;
  grantAmount: string;
  remainingGrants: number;
  endDate: Date;
  active: boolean;
  isCancelled: boolean;
  cancellationReason: string;
  cancelledAt: Date | null;
  tokenSymbol: string;
  tokenId: string;
  tokenUrl: string;
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

const categorizeScholarships = (scholarships: Scholarship[]): { live: Scholarship[]; ended: Scholarship[] } => {
  const live: Scholarship[] = [];
  const ended: Scholarship[] = [];

  for (const scholarship of scholarships) {
    if (scholarship.isCancelled || new Date() > scholarship.endDate) {
      ended.push(scholarship);
    } else {
      live.push(scholarship);
    }
  }

  return { live, ended };
};

const MyActivity = () => {
  const { address } = useAccount();
  const { getUserActivity, getApplicationsForScholarship, approveApplication, cancelScholarship } = useContractInteraction();
  
  // Add notification state
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false
  });

  // Add showNotification helper
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  // Define all state variables at the top of the component
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [scholarshipApplications, setScholarshipApplications] = useState<any[]>([]);
  const [createdScholarships, setCreatedScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [reviewingScholarship, setReviewingScholarship] = useState<Scholarship | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const calculateTotalGrant = (scholarship: Scholarship) => {
    const amount = parseFloat(scholarship.grantAmount);
    const total = amount * scholarship.totalGrants;
    return total.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 6 
    });
  };

  const fetchUserActivity = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const data = await getUserActivity(address);
      setUserApplications(data.applications);
      setCreatedScholarships(data.scholarships);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserActivity();
    }
  }, [address]);

  const handleScholarshipClick = async (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    try {
      const apps = await getApplicationsForScholarship(scholarship.id);
      console.log('Raw applications:', apps); // Debug log
      setScholarshipApplications(apps);
      setShowScholarshipModal(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showNotification('Failed to fetch applications', 'error');
    }
  };

  const handleApproveApplication = async (applicationId: number) => {
    try {
      setReviewLoading(true);
      await approveApplication(reviewingScholarship!.id, applicationId);
      
      // Refresh both the applications list and the overall user activity
      await fetchScholarshipApplications(reviewingScholarship!.id);
      await fetchUserActivity(); // Add this line to refresh all data
      
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

  const handleApplicationClick = (application: any) => {
    setSelectedApplication(application);
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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
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
              {userApplications.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  You haven't applied to any scholarships yet
                </div>
              ) : (
                <div className="space-y-4">
                  {userApplications.map((application) => (
                    <div 
                      key={application.id} 
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleApplicationClick(application)}
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
                    <div
                      key={scholarship.id}
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleScholarshipClick(scholarship)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{scholarship.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-400/10 text-green-400 border border-green-400/20">
                              Active
                            </span>
                            <span className="text-sm text-gray-400">
                              Click to view applicants
                            </span>
                          </div>
                        </div>

                        {/* Grant Amount Display in Card */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <div className="flex items-baseline justify-center">
                            <span className="text-2xl font-bold text-orange-400">
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
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {scholarship.remainingGrants} / {scholarship.totalGrants} grants remaining
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Ends: {formatDateTime(scholarship.endDate)}
                        </span>
                      </div>
                    </div>
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
                        setReviewingScholarship(scholarship);
                        fetchScholarshipApplications(scholarship.id);
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
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedApplication.scholarship?.name}</h2>
                    <div className="flex items-center gap-2">
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
                    onClick={() => setSelectedApplication(null)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Add Cancellation Modal */}
          {showCancelModal && selectedScholarship && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
              onClick={() => setShowCancelModal(false)}
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
                      setShowCancelModal(false);
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowScholarshipModal(false)}
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
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedScholarship.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      Grant per person: {selectedScholarship.grantAmount} {selectedScholarship.tokenSymbol}
                    </span>
                    <span className="text-sm text-gray-400">
                      Total pool: {calculateTotalGrant(selectedScholarship)} {selectedScholarship.tokenSymbol}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowScholarshipModal(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Applications List */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Applications</h3>
                  {!selectedScholarship.isCancelled && new Date() <= selectedScholarship.endDate && (
                    <button
                      onClick={() => setShowCancelModal(true)}
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
                          onClick={() => handleApproveApplication(application.id)}
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
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
                  <h2 className="text-2xl font-bold text-white">{reviewingScholarship.name}</h2>
                  <span className="text-sm bg-gray-800 px-2 py-1 rounded-lg text-gray-400 mt-2 inline-block">
                    Scholarship ID: {reviewingScholarship.id}
                  </span>
                </div>
                <p className="text-gray-400">Review and approve applications</p>
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
                            onClick={() => handleApproveApplication(application.id)}
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
