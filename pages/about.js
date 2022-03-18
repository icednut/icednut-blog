import Head from "next/head";
import Instafeed from "instafeed.js";
import { useEffect } from "react";
import "./life.module.css";
import ReactGA from 'react-ga';
import BlogHeader from "../components/header";
import BlogFooter from "../components/footer";

export default function About({ insToken, gaid }) {

  useEffect(() => {
    if (gaid) {
      ReactGA.initialize(gaid);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }  
  }, []);

  return (
    <>
      <Head>
        <title>Icednut's Space | About</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Welcome to Icednut's Space! This is my coding training blog. (e.g. Scala, Functional Programming)" />
        <meta name="keywords" content="Scala, Kotlin, Functional Programming" />
        <meta author="icednut" />
        <meta name="og:site_name" content="Icednut's Space" />
        <meta name="og:title" content="Icednut's Space" />
        <meta name="og:description" content="Welcome to Icednut's Space! This is my coding training blog. (e.g. Scala, Functional Programming)" />
        <meta name="og:type" content="website" />
      </Head>

      <BlogHeader/>

      <main className="px-4 w-3/4 mx-auto">
        <div id="page-title" className="flex flex-col items-center gap-6 px-6 pt-36 pb-12 break-normal text-black dark:text-white">
          <p>준비 중</p>
          {/* <div id="my_face" className="flex-none">
            <img className="w-36 h-36 object-cover rounded-full ring-2 ring-offset-4 dark:ring-offset-black ring-zinc-700 dark:ring-zinc-200" src="/imgs/adapter.jpg" />
          </div>
          <div id="about_me" className="flex-1 flex flex-col gap-3">
            <h1 className="text-4xl font-bold special-elite">Lee Wan Geun</h1>
            <div className="text-xl special-elite">
              Software Engineer.
            </div>
          </div> */}
        </div>

      </main>

      <BlogFooter />
    </>
  );
}

export const getStaticProps = async () => {
  return {
    props: {
      insToken: process.env.INS_TOKEN,
      gaid: process.env.GAID
    },
    revalidate: 1,
  };
};
