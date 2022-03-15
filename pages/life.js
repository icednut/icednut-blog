import Head from "next/head";
import Instafeed from "instafeed.js";
import { useEffect } from "react";
import "./life.module.css";
import BlogHeader from "../component/header";
import BlogFooter from "../component/footer";

const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

export default function Life({  }) {
  useEffect(() => {
    const feed = new Instafeed({
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
      accessToken: `${instagramAccessToken}`
    });
  
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
        <div id="blog_hero" className="grid grid-cols-1 items-center content-center gap-3 px-6 py-36 break-normal text-black dark:text-white">
          <h1 className="text-3xl font-bold text-center post-title">Life</h1>
          <div className="flex flex-row flex-wrap gap-3 px-4 justify-center text-lg">
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
    },
    revalidate: 1,
  };
};
