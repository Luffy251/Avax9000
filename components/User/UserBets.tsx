import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicClient, useAccount, useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { formatEther } from 'viem';

interface BetStructOutput {
  creator: string;
  description: string;
  totalPool: bigint;
  option1Pool: bigint;
  option2Pool: bigint;
  creationTime: bigint;
  endTime: bigint;
  isResolved: boolean;
  winningOption: number;
}

interface UserBet {
  id: number;
  description: string;
  amount: bigint;
  isResolved: boolean;
  winningOption: number;
  option: number;
  totalPool: bigint;
  creator: string;
  creationTime: bigint;
  endTime: bigint;
}

const UserBets: React.FC = () => {
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [expandedBetId, setExpandedBetId] = useState<number | null>(null);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { data: betsCount } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextBetId',
  });

  const fetchUserBets = async () => {
    if (betsCount && publicClient && address) {
      setIsLoading(true);
      try {
        const fetchedBets: UserBet[] = [];
        for (let i = 0; i < Number(betsCount); i++) {
          const userBet1 = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'userBets',
            args: [BigInt(i), address, 1],
          }) as bigint;
          const userBet2 = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'userBets',
            args: [BigInt(i), address, 2],
          }) as bigint;
          
          if (userBet1 > BigInt(0) || userBet2 > BigInt(0)) {
            const betData = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'bets',
              args: [BigInt(i)],
            });

            console.log(`Raw bet data for ID ${i}:`, betData);

            // Access betData as an array based on the contract struct order
            const bet: UserBet = {
              id: i,
              creator: betData[0],
              description: betData[1],
              totalPool: betData[2],
              amount: userBet1 > BigInt(0) ? userBet1 : userBet2,
              creationTime: betData[5],
              endTime: betData[6],
              isResolved: betData[7],
              winningOption: Number(betData[8]),
              option: userBet1 > BigInt(0) ? 1 : 2
            };

            console.log(`Processed bet ${i}:`, bet);
            fetchedBets.push(bet);
          }
        }
        console.log('All fetched bets:', fetchedBets);
        setUserBets(fetchedBets);
      } catch (err) {
        console.error('Error fetching user bets:', err);
        setError('Failed to fetch your bets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchUserBets();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (betsCount && publicClient && address) {
      fetchUserBets();
    }
  }, [betsCount, publicClient, address]);

  const handleBetClick = (betId: number) => {
    setExpandedBetId(expandedBetId === betId ? null : betId);
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center py-4"
      >
        {error}
      </motion.div>
    );
  }

  const BetCard = ({ bet }: { bet: UserBet }) => (
    <motion.div
      layoutId={`bet-${bet.id}`}
      onClick={() => handleBetClick(bet.id)}
      className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-blue-600 font-semibold text-lg">
            Your Bet: {formatEther(bet.amount)} AVAX
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              bet.isResolved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {bet.isResolved ? 'Resolved' : 'Active'}
          </span>
        </div>
        <motion.div
          animate={{ rotate: expandedBetId === bet.id ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence>
        {expandedBetId === bet.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Bet Description</h4>
                <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg">
                  {bet.description || 'No description available'}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Your Choice</h4>
                  <p className="text-blue-600 font-medium">
                    {bet.option === 1 ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Pool</h4>
                  <p className="text-gray-800 font-medium">
                    {formatEther(bet.totalPool)} AVAX
                  </p>
                </div>
              </div>
              {bet.isResolved && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Outcome</h4>
                  <p className={`font-medium ${
                    bet.winningOption === bet.option 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {bet.winningOption === 1 ? 'Yes' : 'No'}
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">End Time</h4>
                <p className="text-gray-600">
                  {new Date(Number(bet.endTime) * 1000).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Bets</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : userBets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">You haven't placed any bets yet.</p>
          </motion.div>
        ) : (
          <>
            <div className="flex space-x-2 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab('active');
                  setExpandedBetId(null);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 
                  ${activeTab === 'active' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Active Bets ({userBets.filter(bet => !bet.isResolved).length})
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab('resolved');
                  setExpandedBetId(null);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 
                  ${activeTab === 'resolved' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Resolved Bets ({userBets.filter(bet => bet.isResolved).length})
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {userBets
                  .filter(bet => (activeTab === 'active' ? !bet.isResolved : bet.isResolved))
                  .map((bet) => (
                    <BetCard key={bet.id} bet={bet} />
                  ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default UserBets;