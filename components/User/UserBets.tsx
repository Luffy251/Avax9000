import React, { useEffect, useState } from 'react';
import { usePublicClient, useAccount, useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { formatEther } from 'viem';

interface UserBet {
  id: number;
  description: string;
  amount: bigint;
  isResolved: boolean;
  winningOption: number;
}

const UserBets: React.FC = () => {
  const [userBets, setUserBets] = useState<UserBet[]>([]);
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
    const fetchUserBets = async () => {
      if (betsCount && publicClient && address) {
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
              const bet = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'bets',
                args: [BigInt(i)],
              }) as any;
              fetchedBets.push({
                id: i,
                description: bet.description,
                amount: userBet1 + userBet2,
                isResolved: bet.isResolved,
                winningOption: bet.winningOption,
              });
            }
          }
          console.log('Fetched user bets:', fetchedBets);
          setUserBets(fetchedBets);
        } catch (err) {
          console.error('Error fetching user bets:', err);
          setError('Failed to fetch your bets. Please try again.');
        }
      }
    };

    if (isClient) {
      fetchUserBets();
    }
  }, [betsCount, publicClient, address, isClient]);

  if (!isClient) return null;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">My Bets</h2>
      {userBets.length === 0 ? (
        <p>You haven't placed any bets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBets.map((bet) => (
            <div key={bet.id} className="border p-4 rounded">
              <h3 className="font-bold">{bet.description}</h3>
              <p>Your Bet: {formatEther(bet.amount)} AVAX</p>
              <p>Status: {bet.isResolved ? 'Resolved' : 'Ongoing'}</p>
              {bet.isResolved && (
                <p>Winning Option: {bet.winningOption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBets;