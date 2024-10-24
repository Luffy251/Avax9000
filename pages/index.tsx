import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Trophy, Zap, Shield, Users, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StatCardProps {
  value: string;
  label: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/10">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
      <Icon className="w-6 h-6 text-purple-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StatCard = ({ value, label }: StatCardProps) => (
  <div className="bg-white/5 p-4 rounded-lg text-center">
    <div className="text-2xl font-bold text-purple-400">{value}</div>
    <div className="text-sm text-gray-300">{label}</div>
  </div>
);

const Home: NextPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartBetting = () => {
    router.push('/all-bets');
  };

  return (
    <Layout>
      <Head>
        <title>BetWin | Decentralized Betting on Avalanche</title>
        <meta name="description" content="Create bets, place wagers, and win big with our decentralized betting platform powered by Avalanche" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className={`container mx-auto px-4 pt-20 pb-32 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Welcome to BetWin
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience the future of betting on Avalanche the fastest and most secure blockchain network
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleStartBetting}
                className="px-8 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-semibold transition-all duration-300"
              >
                Start Betting
              </button>
            </div>
          </div>
        </div>
        <div className="bg-black/20 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value="$1M+" label="Total Volume" />
              <StatCard value="10K+" label="Active Users" />
              <StatCard value="99.9%" label="Uptime" />
              <StatCard value="<2s" label="Bet Settlement" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Why Choose BetWin?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Leverage Avalanche's sub-second finality for instant bet settlements"
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Fair"
              description="Smart contract-powered betting with transparent odds and payouts"
            />
            <FeatureCard
              icon={Users}
              title="Community Driven"
              description="Join a thriving community of bettors and create your own markets"
            />
            <FeatureCard
              icon={Trophy}
              title="Rewarding"
              description="Earn rewards for participation and climb the leaderboard"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;