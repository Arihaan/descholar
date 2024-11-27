import { Scholarship } from "@/bindings/dist";
import { motion, AnimatePresence } from "framer-motion";

interface ScholarshipConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  scholarship: {
    name: string;
    details: string;
    available_grants: number;
    grant_amount: number;
    end_date: string;
  };
  walletAddress: string;
}

const ScholarshipConfirmation = ({
  isOpen,
  onClose,
  onConfirm,
  scholarship,
  walletAddress,
}: ScholarshipConfirmationProps) => {
  const totalCost = scholarship.grant_amount * scholarship.available_grants;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-700 w-full max-w-2xl relative z-50"
          >
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Create this scholarship?
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Scholarship Details
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-400">Name:</span>{" "}
                    {scholarship.name}
                  </p>
                  <p>
                    <span className="text-gray-400">Description:</span>{" "}
                    {scholarship.details}
                  </p>
                  <p>
                    <span className="text-gray-400">Available Grants:</span>{" "}
                    {scholarship.available_grants}
                  </p>
                  <p>
                    <span className="text-gray-400">Amount per Grant:</span>{" "}
                    {scholarship.grant_amount} XLM
                  </p>
                  <p>
                    <span className="text-gray-400">End Date:</span>{" "}
                    {new Date(scholarship.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Your Wallet
                </h3>
                <p className="text-sm text-gray-300 break-all">
                  {walletAddress}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Total Cost
                </h3>
                <p className="text-2xl font-bold text-orange-500">
                  {totalCost} XLM
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200"
              >
                Create ({totalCost} XLM)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScholarshipConfirmation;
