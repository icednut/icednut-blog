import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDatabase, getPostingDate, getTagCloud } from "../lib/notion";
import { Text, getTags, getThumbnailUrl } from "./[id].js";

export const databaseId = process.env.NOTION_DATABASE_ID;

const getExtraContentUrl = (post) => {
  if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
    return `/${post.id}`;
  }
  var extraContentUrl;
  switch (post.properties.cms.select.name) {
    case "velog":
      extraContentUrl = post.properties.extra_contents.rich_text[0].href;
      break;
    default:
      extraContentUrl = `/${post.id}`;
      break;
  }
  return extraContentUrl;
};

const getPostPrviewDom = (post) => {
  var postType = 'default';
  var postPreview = (<div className="invisible"></div>);

  if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
    postType = 'default';
  } else {
    postType = post.properties.cms.select.name;
  }

  switch (postType) {
    case "velog":
      break;
    default:
      postPreview = (
        <p className="text-base text-zinc-400 dark:text-zinc-400 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
        </p>
      );
      break;
  }

  return postPreview;
};

const getPostThumbnail = (post) => {
  const thumbnailUrl = getThumbnailUrl(post);
  var postThumbnail = (
    <Link href={`/${post.id}`}>
      <div className="w-full h-64 cursor-pointer bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
    </Link>
  );

  if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
    return postThumbnail;
  }

  const extraContentUrl = getExtraContentUrl(post);

  switch (post.properties.cms.select.name) {
    case "velog":
      postThumbnail = (
        <Link href={extraContentUrl}>
          <div className="bg-slate-200 flex flex-col justify-center h-64 cursor-pointer">
            <div className="text-6xl md:text-8xl lg:text-8xl text-slate-600 text-center">Velog</div>
          </div>
        </Link>
      );
      break;
    default:
      break;
  }
  return postThumbnail;
};

export default function Home({ posts, tagCloud }) {
  const [isShowMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("");

  const toggleMenu = () => {
    setShowMenu(!isShowMenu);
  };

  const toggleTheme = () => {
    const themeFromLocalStorage = localStorage.getItem("icednut-theme");

    if (themeFromLocalStorage === 'dark') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem("icednut-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem("icednut-theme", "dark");
      setTheme("dark");
    }
    console.log(localStorage.getItem("icednut-theme"), theme);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("icednut-theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    document.documentElement.classList.add(currentTheme);
    setTheme(currentTheme);
  }, []);

  return (
    <div>
      <Head>
        <title>Icednut's Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4">
        <header>
          <div className="fixed px-8 py-5 inset-x-0 bg-white dark:bg-black drop-shadow-md flex flex-col gap-7">
            <div className="flex flex-row justify-between">
              <Link href="/">
                <p className="post-content-title cursor-pointer text-black dark:text-white">Icednut's Space</p>
              </Link>
              <div className="flex flex-row gap-4">
                <div className="hidden md:block lg:block xl:block">
                  <div className="flex flex-row gap-5">
                    <p className="text-black dark:text-white">About</p>
                    <Link href="/">
                      <p className="cursor-pointer text-black dark:text-white">Blog</p>
                    </Link>
                    <p className="text-black dark:text-white">Life</p>
                    <button className="cursor-pointer" onClick={toggleTheme}>
                      {
                        theme === "dark" ?
                          (
                            <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          ) :
                          (
                            <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          )
                      }
                    </button>
                  </div>
                </div>
                <div className="block md:hidden lg:hidden xl:hidden">
                  <button onClick={toggleTheme}>
                    {
                      theme === "dark" ?
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) :
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )
                    }
                  </button>
                </div>
                <div className="block md:hidden lg:hidden xl:hidden" onClick={toggleMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" key="menu" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            </div>
            <div id="mobile_toolbar_menu" className={(isShowMenu ? "flex" : "hidden") + " flex-col gap-5 pl-4"}>
              <p className="text-black dark:text-white">About</p>
              <Link href="/">
                <p className="cursor-pointer text-black dark:text-white">Blog</p>
              </Link>
              <p className="text-black dark:text-white">Life</p>
            </div>
          </div>
          <div className="h-16"></div>
        </header>

        <div className="max-w-screen-xl mx-auto">
          <div id="blog_hero" className="grid grid-cols-1 items-center content-center gap-5 px-6 py-44 break-normal">
            <h1 className="text-3xl font-bold text-center post-title text-black dark:text-white">Blog</h1>
            <div id="tags" className="flex flex-row flex-wrap gap-3 px-4 justify-center">
              {
                Object.keys(tagCloud).map(tag => {
                  return (
                    <div className="flex flex-row flex-wrap gap-1">
                      <p className="blog-link text-sm text-black dark:text-white">#{tag}</p>
                      {
                        tagCloud[tag] > 1 ? 
                          (<p className="bg-sky-500 text-white rounded-full px-2 text-sm">{tagCloud[tag]}</p>) :
                          (<p className="hidden"></p>)
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div id="recent_posts" className="mb-24">
            <div className="flex gap-2 pb-1 mb-4 items-center">
              <p className="flex-none text-xs text-zinc-400">Recent Posts</p>
              <div className="h-0.5 w-full border-b border-zinc-300"></div>
            </div>
            <ol className="px-2 list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {posts.filter((post) => post.properties.Published.checkbox).filter((post, index) => index <= 2).map((post, index) => {
                const date = getPostingDate(post);
                const tags = getTags(post);
                const postThumbnail = getPostThumbnail(post);
                const postPreview = getPostPrviewDom(post);
                const postUrl = getExtraContentUrl(post);
                let postDom;

                switch (index) {
                  case 0:
                    postDom = (
                      <li key={post.id} className="col-span-full flex flex-col gap-2 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={postUrl}>
                              <p className="font-bold text-lg text-black dark:text-white cursor-pointer post-title">
                                <Text text={post.properties.Page.title} />
                              </p>
                            </Link>
                          </h3>
                        </div>
                        <div className="shrink">{postPreview}</div>
                        <div className="flex-none">
                          {tags}
                        </div>
                      </li>
                    )
                    break;
                  default:
                    postDom = (
                      <li key={post.id} className="flex flex-col gap-2 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={postUrl}>
                              <p className="font-bold text-lg text-black dark:text-white cursor-pointer post-title">
                                <Text text={post.properties.Page.title} />
                              </p>
                            </Link>
                          </h3>
                        </div>
                        <div className="shrink">{postPreview}</div>
                        <div className="flex-none">{tags}</div>
                      </li>
                    )
                    break;
                }
                return postDom;
              })}
            </ol>
          </div>
          <div id="all_posts">
            <div className="flex gap-2 pb-1 mb-4 items-center">
              <p className="flex-none text-xs text-zinc-400">All Posts</p>
              <div className="h-0.5 w-full border-b border-zinc-300"></div>
            </div>
            <ol className="px-2 list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.filter((post) => post.properties.Published.checkbox).filter((post, index) => index > 2).map((post, index) => {
                const date = getPostingDate(post);
                const tags = getTags(post);
                const postPreview = getPostPrviewDom(post);
                const postUrl = getExtraContentUrl(post);

                return (
                  <li key={post.id} className="flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={postUrl}>
                          <p className="font-bold text-lg text-black dark:text-white cursor-pointer post-title">
                            <Text text={post.properties.Page.title} />
                          </p>
                        </Link>
                      </h3>
                    </div>
                    <div className="shrink">{postPreview}</div>
                    <div className="flex-none">
                      {tags}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-12 flex flex-row justify-center">
              <button className="blog-btn w-full md:w-28 lg:w-28 xl:w-28 font-bold">
                More
              </button>
            </div>
          </div>
        </div>

        <footer>
          <div className="mt-44 pt-8 pb-12 text-sm text-center text-black dark:text-white">
            (C) 2022. Icednut All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);
  const tagCloud = getTagCloud(database);

  return {
    props: {
      posts: database,
      tagCloud: tagCloud
    },
    revalidate: 1,
  };
};
