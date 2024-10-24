import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePublicClient, useAccount, useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { formatEther } from 'viem';

const UserWinnings: React.FC = () => {
  const [totalWinnings, setTotalWinnings] = useState('0');
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { data: betsCount } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextBetId',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchUserWinnings = async () => {
      if (betsCount && publicClient && address) {
        try {
          let winnings = BigInt(0);
          for (let i = 0; i < Number(betsCount); i++) {
            const bet = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'bets',
              args: [BigInt(i)],
            }) as any;
            if (bet.isResolved) {
              const userWinnings = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'calculateWinnings',
                args: [BigInt(i), address],
              }) as bigint;
              winnings += userWinnings;
            }
          }
          console.log('Total winnings:', winnings);
          setTotalWinnings(formatEther(winnings));
        } catch (err) {
          console.error('Error fetching user winnings:', err);
          setError('Failed to fetch your winnings. Please try again.');
        }
      }
    };

    if (isClient) {
      fetchUserWinnings();
    }
  }, [betsCount, publicClient, address, isClient]);

  if (!isClient) return null;

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Total Winnings</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white"
      >
        <div className="relative z-10">
          <p className="text-purple-100 mb-2">Total Earnings</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold">{totalWinnings}</span>
            <span className="text-xl text-purple-100">AVAX</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />
      </motion.div>

      <div className="mt-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
        >
          <span className="text-gray-600">Status</span>
          <span className="font-medium text-green-600">Available</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
        >
          <span className="text-gray-600">Network</span>
          <span className="font-medium text-gray-800">Avalanche Fuji</span>
        </motion.div>
      </div>
    </div>
  );
};

export default UserWinnings;