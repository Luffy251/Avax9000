import React from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          BetWin
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/create-bet" className="text-white hover:text-blue-200">
            Create Bet
          </Link>
          <Link href="/all-bets" className="text-white hover:text-blue-200">
            All Bets
          </Link>
          <Link href="/my-bets" className="text-white hover:text-blue-200">
            My Bets
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;