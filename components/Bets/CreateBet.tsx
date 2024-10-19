import React, { useState } from 'react';
import { useAccount, useWalletClient, usePublicClient, useContractWrite } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config';
import { parseEther } from 'viem';

const CreateBet: React.FC = () => {
  const [description, setDescription] = useState('');
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const { write: createBet, isLoading, isSuccess, isError } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'createBet',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description && address) {
      try {
        createBet({ args: [description] });
      } catch (error) {
        console.error('Error creating bet:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a New Bet</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Bet description"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded"
        disabled={isLoading || !address}
      >
        {isLoading ? 'Creating...' : 'Create Bet'}
      </button>
      {isSuccess && <p className="text-green-500 mt-2">Bet created successfully!</p>}
      {isError && <p className="text-red-500 mt-2">Error creating bet. Please try again.</p>}
    </form>
  );
};

export default CreateBet;