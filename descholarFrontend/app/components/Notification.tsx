"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const Notification = ({ message, type, isVisible, onClose }: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-8 right-8 z-50"
        >
          <div className={`rounded-xl shadow-lg p-4 flex items-center space-x-3 ${
            type === 'success' 
              ? 'bg-green-900/80 border border-green-700/50' 
              : 'bg-red-900/80 border border-red-700/50'
          } backdrop-blur-sm max-w-md`}>
            <div className={`flex-shrink-0 p-2 rounded-full ${
              type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {type === 'success' ? (
                <FiCheck className="w-5 h-5 text-green-300" />
              ) : (
                <FiAlertTriangle className="w-5 h-5 text-red-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${
                type === 'success' ? 'text-green-100' : 'text-red-100'
              }`}>
                {message}
              </p>
            </div>
            <button 
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-black/20 ${
                type === 'success' ? 'text-green-300' : 'text-red-300'
              }`}
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification; 