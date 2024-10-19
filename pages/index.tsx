import type { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>BetWin</title>
        <meta name="description" content="Decentralized Betting Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to BetWin</h1>
        <p className="text-xl">
          Create bets, place wagers, and win big with our decentralized betting platform!
        </p>
      </main>
    </Layout>
  );
};

export default Home;