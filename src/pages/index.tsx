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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Modul wählen
          </h1>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="checkin"
            >
              <div className="text-9xl">🎫</div>
              <h3 className="text-2xl font-bold">Check-In</h3>
            </Link>
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="/service"
            >
              <div className="text-9xl">🍾</div>
              <h3 className="text-2xl font-bold">Service</h3>
            </Link>
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
            >
              <div className="text-9xl">🚪</div>
              <h3 className="text-2xl font-bold">Check-Out</h3>
            </Link>
            <Link
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
              href="/admin"
            >
              <div className="text-9xl">🐧</div>
              <h3 className="text-2xl font-bold">Admin</h3>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
