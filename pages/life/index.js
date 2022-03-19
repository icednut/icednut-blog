import Head from "next/head";
import Instafeed from "instafeed.js";
import { useEffect } from "react";
import "./life.module.css";
import ReactGA from 'react-ga';
import BlogHeader from "../../components/header";
import BlogFooter from "../../components/footer";

export default function Life({ insToken, gaid }) {

  useEffect(() => {
    if (gaid) {
      ReactGA.initialize(gaid);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  
    const instafeedOption = {
      transform: function(item) {
        item.timestamp = new Date(item.timestamp).toLocaleString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        );  
        return item;
      },
      template: `<li class="border border-zinc-200 dark:border-zinc-700">
          <a href="{{link}}">
            <div class="w-full h-64 cursor-pointer bg-cover bg-center" style="background-image: url({{image}})"></div>
          </a>
          <div class="pt-4 pb-6 px-4 flex flex-col gap-3">
            <p class="text-sm text-zinc-500">{{timestamp}}</p>
            <pre class="insta-content">{{caption}}</pre>
          </div>
        </li>`,
      accessToken: `${insToken}`
    };

    const feed = new Instafeed(instafeedOption);
    feed.run();
  }, []);

  return (
    <>
      <Head>
        <title>Icednut's Space | Life</title>
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

      <main className="px-4">
        <div id="page-title" className="grid grid-cols-1 items-center content-center gap-3 px-6 py-36 break-normal text-black dark:text-white">
          <h1 className="text-4xl font-bold text-center special-elite">Life</h1>
          <div className="flex flex-row flex-wrap gap-3 px-4 justify-center text-lg special-elite">
            Try to be good when I'm gone.
          </div>
        </div>
        <ul id="instafeed" className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-10">
        </ul>
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
