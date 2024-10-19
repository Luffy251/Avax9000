import React, { useState, useEffect } from 'react';
import { useContractWrite, useAccount, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { parseEther, formatEther } from 'viem';

interface BetItemProps {
  bet: any;
  betId: number;
}

const BetItem: React.FC<BetItemProps> = ({ bet, betId }) => {
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { address } = useAccount();

  const { write: placeBet, data: placeBetData, isLoading: isPlacingBet, isError: isPlaceBetError, error: placeBetError } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'placeBet',
  });

  const { isLoading: isWaitingForTransaction, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: placeBetData?.hash,
  });

  useEffect(() => {
    console.log('Bet object in BetItem:', bet);
  }, [bet]);

  const handlePlaceBet = async () => {
    if (selectedOption !== null && amount && address) {
      try {
        await placeBet({ 
          args: [BigInt(betId), BigInt(selectedOption)], 
          value: parseEther(amount) 
        });
      } catch (error) {
        console.error('Error placing bet:', error);
      }
    }
  };

  const formatDate = (timestamp: bigint | undefined) => {
    if (!timestamp) return 'Unknown';
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const safeFormatEther = (value: bigint | undefined) => {
    if (!value) return '0';
    return formatEther(value);
  };

  if (!bet) {
    return <div>Loading bet information...</div>;
  }

  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">{bet.description || 'No description'}</h3>
      <p>Total Pool: {safeFormatEther(bet.totalPool)} AVAX</p>
      <p>Option 1 Pool: {safeFormatEther(bet.option1Pool)} AVAX</p>
      <p>Option 2 Pool: {safeFormatEther(bet.option2Pool)} AVAX</p>
      <p>Bet ID: {betId}</p>
      <p>Created at: {formatDate(bet.creationTime)}</p>
      <p>Ends at: {formatDate(bet.endTime)}</p>
      <p>Resolved: {bet.isResolved ? 'Yes' : 'No'}</p>
      {bet.isResolved && <p>Winning Option: {bet.winningOption}</p>}
      <div className="mt-2">
        <button
          onClick={() => setSelectedOption(1)}
          className={`mr-2 p-2 rounded ${
            selectedOption === 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setSelectedOption(2)}
          className={`p-2 rounded ${
            selectedOption === 2 ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}
        >
          No
        </button>
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in AVAX"
        className="w-full p-2 mt-2 border rounded"
      />
      <button
        onClick={handlePlaceBet}
        className="w-full bg-blue-500 text-white p-2 rounded mt-2"
        disabled={isPlacingBet || isWaitingForTransaction || !selectedOption || !amount || !address || bet.isResolved}
      >
        {isPlacingBet || isWaitingForTransaction ? 'Placing Bet...' : 'Place Bet'}
      </button>
      {isTransactionSuccess && <p className="text-green-500 mt-2">Bet placed successfully!</p>}
      {isPlaceBetError && <p className="text-red-500 mt-2">Error placing bet: {placeBetError?.message || 'Please try again.'}</p>}
    </div>
  );
};

export default BetItem;