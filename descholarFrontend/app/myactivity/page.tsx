"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { useAccount } from "wagmi";

interface Application {
  id: number;
  scholarshipId: number;
  name: string;
  details: string;
  status: string;
  appliedAt: Date;
  grantAmount: string;
}

interface CreatedScholarship {
  id: number;
  name: string;
  grantAmount: string;
  remainingGrants: number;
  endDate: Date;
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

const MyActivity = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [createdScholarships, setCreatedScholarships] = useState<CreatedScholarship[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewingScholarship, setReviewingScholarship] = useState<CreatedScholarship | null>(null);
  const [scholarshipApplications, setScholarshipApplications] = useState<ScholarshipApplication[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const { 
    getUserActivity, 
    getApplicationsForScholarship, 
    approveApplication,
    isInitialized 
  } = useContractInteraction();
  const { address } = useAccount();

  useEffect(() => {
    if (isInitialized && address) {
      fetchUserActivity();
    }
  }, [isInitialized, address]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const data = await getUserActivity(address!);
      setApplications(data.applications);
      setCreatedScholarships(data.createdScholarships);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  const fetchScholarshipApplications = async (scholarshipId: number) => {
    try {
      setReviewLoading(true);
      console.log('Fetching applications for scholarship ID:', scholarshipId);
      const applications = await getApplicationsForScholarship(scholarshipId);
      console.log('Received applications:', applications);
      if (Array.isArray(applications)) {
        setScholarshipApplications(applications);
      } else {
        console.error('Unexpected applications data format:', applications);
        setScholarshipApplications([]);
      }
    } catch (error) {
      console.error('Error fetching scholarship applications:', error);
      alert('Failed to load applications. Please try again.');
      setScholarshipApplications([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId: number) => {
    try {
      setReviewLoading(true);
      await approveApplication(reviewingScholarship!.id, applicationId);
      await fetchScholarshipApplications(reviewingScholarship!.id);
      alert('Application approved successfully!');
    } catch (error: any) {
      console.error('Error approving application:', error);
      alert(error.message || 'Failed to approve application');
    } finally {
      setReviewLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your activity</p>
        </div>
      </div>
    );
  }

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
                    <motion.div
                      key={application.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-2">{application.name}</h3>
                          <p className="text-sm text-gray-300">
                            Applied on: {application.appliedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`flex items-center ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="text-sm">{application.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Created Scholarships Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-white">Created Scholarships</h2>
              {createdScholarships.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  You haven't created any scholarships yet
                </div>
              ) : (
                <div className="space-y-4">
                  {createdScholarships.map((scholarship) => (
                    <motion.div
                      key={scholarship.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-900 bg-opacity-40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">{scholarship.name}</h3>
                        <span className="text-sm text-orange-400 font-semibold">
                          {scholarship.grantAmount} EDU
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>{scholarship.remainingGrants} Grants Remaining</span>
                        <span>Ends: {scholarship.endDate.toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setReviewingScholarship(scholarship);
                          fetchScholarshipApplications(scholarship.id);
                        }}
                        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl"
                      >
                        Review Applications
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
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
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Scholarship</h3>
                    <p className="text-gray-300">{selectedApplication.name}</p>
                    <p className="text-orange-400 text-sm mt-1">Grant Amount: {selectedApplication.grantAmount} EDU</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Your Application</h3>
                    <p className="text-gray-300">{selectedApplication.details}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Status</h3>
                    <div className={`flex items-center ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      <span>{selectedApplication.status}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-white font-semibold mb-2">Applied On</h3>
                    <p className="text-gray-300">{selectedApplication.appliedAt.toLocaleDateString()}</p>
                  </div>
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
                <h2 className="text-2xl font-bold mb-2 text-white">{reviewingScholarship.name}</h2>
                <p className="text-gray-400 mb-6">Review and approve applications</p>

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
                            <p className="text-sm text-gray-400">
                              Applied: {new Date(application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`flex items-center ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span>{application.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{application.details}</p>
                        {application.status === 'Applied' && (
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
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MyActivity;
