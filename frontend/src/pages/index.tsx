import Head from "next/head";
import { Login } from "src/features/auth/components/Login";

const Home = () => (
  <>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="h-screen min-h-screen">
      <div className=" flex h-full w-full flex-col  justify-center">
        <Login />
      </div>
    </main>
  </>
)

export default Home;
