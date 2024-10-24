import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { useRouter } from 'next/router';

const CreateBet: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const { write: createBet, data: createBetData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createBet',
  });

  const { isLoading: isWaitingForTransaction, isSuccess } = useWaitForTransaction({
    hash: createBetData?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      setDescription('');
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.push('/all-bets');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !address) return;

    setIsSubmitting(true);
    try {
      await createBet({ args: [description] });
    } catch (error) {
      console.error('Error creating bet:', error);
      setShowSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setShowSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create a New Bet
          </h1>
          {description && !isSubmitting && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Reset Form
            </motion.button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700"
            >
              Bet Description
            </label>
            <motion.textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Will Bitcoin reach $100,000 by the end of 2024?"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-h-[120px] text-gray-800"
              whileFocus={{ scale: 1.01 }}
              disabled={isSubmitting || isWaitingForTransaction}
            />
            <p className="text-sm text-gray-500">
              Make sure your description is clear and specific about the betting conditions.
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={!description || isSubmitting || isWaitingForTransaction}
            className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 
              ${(!description || isSubmitting || isWaitingForTransaction) 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-purple-500 hover:bg-purple-600'}`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting || isWaitingForTransaction ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Creating Bet...</span>
              </div>
            ) : (
              'Create Bet'
            )}
          </motion.button>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-green-50 rounded-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg 
                  className="w-5 h-5 text-green-500" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-600 font-medium">
                  Bet created successfully! Redirecting to all bets...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CreateBet;