import React, { useEffect, useState } from 'react';
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">My Total Winnings</h2>
      <p className="text-xl">{totalWinnings} AVAX</p>
    </div>
  );
};

export default UserWinnings;