import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
        <Link href={"/"} className="absolute top-2 left-2 cursor-pointer">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </Link>
        <div className="container flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Übersicht
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="/admin/tickets"
            >
              <div className="text-9xl">🎫</div>
              <h3 className="text-2xl font-bold">Tickets</h3>
            </Link>
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="/admin/drinks"
            >
              <div className="text-9xl">🍷</div>
              <h3 className="text-2xl font-bold">Getränke</h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
