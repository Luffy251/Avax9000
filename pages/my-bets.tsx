import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import UserBets from '../components/User/UserBets';
import UserWinnings from '../components/User/UserWinnings';

const MyBetsPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>My Bets - BetWin</title>
        <meta name="description" content="View your bets and winnings on our decentralized betting platform" />
      </Head>

      <main className="container mx-auto p-4">
        <UserBets />
        <UserWinnings />
      </main>
    </Layout>
  );
};

export default MyBetsPage;