import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { getDatabase, getPostingDate, getPage, getBlocks } from "../lib/notion";
import Link from "next/link";
import { databaseId } from "./index.js";
import styles from "./post.module.css";
import Prism from "prismjs";
import { DiscussionEmbed } from 'disqus-react';
import ReactGA from 'react-ga';
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/autoloader/prism-autoloader";
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/show-language/prism-show-language';
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-scala";

export const gaid = process.env.GAID;

export const Text = ({ text }) => {
  if (!text) {
    return null;
  }
  return text.map((value) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value;

    return (
      <span
        className={[
          bold ? "font-bold" : "",
          code ? styles.codetext + " text-sm bg-slate-200 dark:bg-slate-700 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded align-middle" : "text-black dark:text-white",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : ""
        ].join(" ")}
        style={color !== "default" ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    );
  });
};

const renderBlock = (block) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p className="pb-1">
          <Text text={value.text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className="text-2xl mt-6 mb-2 font-bold border-l-4 pl-2 border-slate-600">
          <Text text={value.text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="text-xl mt-4 mb-2 font-bold border-l-2 pl-2 border-slate-400">
          <Text text={value.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="text-lg mt-3 mb-2 font-bold">
          <Text text={value.text} />
        </h4>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li className="pb-1 list-dot list-none">
          <Text text={value.text} />
        </li>
      );
    case "to_do":
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{" "}
            <Text text={value.text} />
          </label>
        </div>
      );
    case "toggle":
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case "child_page":
      return <p>{value.title}</p>;
    case "image":
      const src =
        value.type === "external" ? value.external.url : value.file.url;
      const caption = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    case "divider":
      return <hr key={id} />;
    case "quote":
      return (
        <pre className="w-full overflow-auto bg-zinc-700 text-zinc-300 p-4 border-l-8 border-sky-400 rounded-r my-2" style={{whiteSpace: 'pre-wrap'}}>
          <blockquote key={id}>
            {value.text[0].plain_text}
          </blockquote>
        </pre>
      );
    case "code":
      return (
        <pre className={"rounded language-" + value.language}>
          <code key={id}>
            {value.text[0].plain_text}
          </code>
        </pre>
      );
    case "file":
      const src_file =
        value.type === "external" ? value.external.url : value.file.url;
      const splitSourceArray = src_file.split("/");
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
      const caption_file = value.caption ? value.caption[0]?.plain_text : "";
      return (
        <figure>
          <div className={styles.file}>
            📎{" "}
            <Link href={src_file} passHref>
              {lastElementInArray.split("?")[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      );
    case "callout":
      var emoji
      
      switch (value.icon.type) {
        case "emoji":
          emoji = value.icon.emoji;
          break;
        default:
          emoji = '';
          break;
      }

      return (
        <pre className="whitespace-pre-line flex bg-zinc-600 text-white font-medium px-4 py-3 mt-1 rounded text-base overflow-auto" key={id}>
          <div className="flex-none w-8">{emoji}</div>
          <p className="shrink">
            {value.text[0].plain_text}
          </p>
        </pre>
      );
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

const getCmsType = (post) => {
  if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
    return null;
  }

  switch (post.properties.cms.select.name) {
    case "velog":
      return "Velog";
    default:
      return null;
  }
};

export const getTags = (page, additionalCssClass) => {
  if (!page.properties || !page.properties.Tags || page.properties.Tags.type != 'multi_select' || !page.properties.Tags.multi_select) {
    return [];
  }

  const tags = page.properties.Tags.multi_select.map(tag => tag.name);
  const cmsType = getCmsType(page);
  var cmsDom = (<></>);

  if (cmsType) {
    cmsDom = (<div className="rounded text-white bg-sky-700 px-2 py-0.5">{cmsType}</div>);
  }

  var cssClass = additionalCssClass;

  if (!cssClass) {
    cssClass = "font-bold text-sm text-black dark:text-white";
  }

  return (
    <div className={"flex flex-wrap gap-2 " + cssClass}>
      {cmsDom}
      {tags.map(tag => (<div className="blog-link">#{tag}</div>))}
    </div>
  );
};

export const getThumbnailUrl = (page) => {
  if (!page.cover || !page.cover.external || !page.cover.external.url) {
    return ''; // TODO: default image url
  }

  return page.cover.external.url;
};

export default function Post({ page, blocks, previousPost, nextPost }) {
  if (!page || !blocks) {
    return <div />;
  }

  const tags = getTags(page, "font-bold text-base justify-center text-white");
  const footerTags = getTags(page, "font-bold text-base text-black dark:text-white"); // TODO: 이거 하나로 합치기
  const postingDate = getPostingDate(page);
  const thumbnailUrl = getThumbnailUrl(page);

  const [isVisiblePostTitle, setVisiblePostTitle] = useState(true);
  const [theme, setTheme] = useState("");

  const togglePostTitle = () => {
    setVisiblePostTitle(!isVisiblePostTitle);
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
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.plugins.autoloader.languages_path = '/prism-grammers/';
      Prism.highlightAll();
    }

    const currentTheme = localStorage.getItem("icednut-theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    document.documentElement.classList.add(currentTheme);
    setTheme(currentTheme);

    if (gaid) {
      ReactGA.initialize(gaid);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{page.properties.Page.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="leading-loose max-w-screen-xl mx-auto px-6">
        <section>
          <div className="absolute inset-0 text-center py-10 bg-cover bg-center z-20" style={{backgroundImage: "url(" + thumbnailUrl + ")"}}>
          </div>
          <div className="absolute inset-0 bg-black opacity-70 z-20">
          </div>
          <div className="absolute inset-0 z-30 flex flex-col justify-between">
            <div className="px-6 pt-20 md:px-28 md:pt-36 lg:px-28 lg:pt-36 xl:px-28 xl:pt-36">
              {tags}
              <h1 className="w-full text-4xl leading-relaxed post-content-title text-center break-normal text-white">
                {page.properties.Page.title[0].plain_text}
              </h1>
              <p className="text-zinc-400 text-center">
                {postingDate}
              </p>
            </div>
            <div className="text-white py-8">
              <a href="#post-content-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
          <div className="h-screen">
          </div>
          <div id="post-content-start" className="invisible py-6 flex flex-col md:flex-row lg:flex-row">
            <div className="justify-between">
              <Link href="/">
                <p className="post-content-title flex-none">Icednut's Space</p>
              </Link>
            </div>
            <div className="post-title grow font-bold">
              <Text text={page.properties.Page.title} />
            </div>
          </div>
          <div className="fixed top-0 inset-x-0 px-8 py-5 bg-white dark:bg-black  drop-shadow-md z-10 flex flex-col md:flex-row lg:flex-row gap-2">
            <div className="flex flex-row justify-between">
              <p className="post-content-title flex-none text-black dark:text-white">Icednut's Space</p>
              <div className="flex flex-row gap-4">
                <div className="block md:hidden lg:hidden xl:hidden">
                  <button className="cursor-pointer" aria-label="Change Theme for Mobile" onClick={toggleTheme}>
                    {
                      theme === "dark" ?
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        ) :
                        (
                          <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        )
                    }
                  </button>
                </div>
                <div className="block md:hidden lg:hidden xl:hidden" onClick={togglePostTitle}>
                  {
                    isVisiblePostTitle ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )
                  }
                </div>
              </div>
            </div>
            <p className="hidden md:block lg:block xl:block">·</p>
            <div className={`post-title ${isVisiblePostTitle ? 'block' : 'hidden'} grow md:block lg:block font-bold text-zinc-500 dark:text-zinc-400`}>
              {page.properties.Page.title[0].plain_text}
            </div>
            <div className="hidden md:block lg:block xl:block">
              <button className="cursor-pointer" aria-label="Change Theme for Desktop" onClick={toggleTheme}>
                {
                  theme === "dark" ?
                    (
                      <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) :
                    (
                      <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )
                }
              </button>
            </div>
          </div>
        </section>
        <section>
          <div className="line-numbers">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
            <div className="mt-5 flex flex-col gap-1">
              <p className="text-sm text-zinc-500 dark:text-zinc-500">Tags:</p>
              <div>
                {footerTags}
              </div>
            </div>
            <div className="w-full mt-6 bg-zinc-600 p-4 rounded">
              <DiscussionEmbed shortname="icednuts-space" config={{
                url: `https://icednut.space/${page.id}`,
                identifier: page.id,
                title: page.properties.Page.title[0].plain_text
              }} />
            </div>
          </div>
          <div id="post-footer" className="mt-32 flex flex-col gap-10 justify-center">
            <div className="flex flex-col md:flex-row lg:flex-row justify-between mb-10 gap-4">
              <div className="flex flex-col justify-start">
                <p className="text-sm text-zinc-500">Previous</p>
                {
                  previousPost ? (
                    <a className="blog-link text-dark dark:text-white" href={`/${previousPost.id}`}>
                      <p>{previousPost.properties.Page.title[0].plain_text}</p>
                    </a>
                  ) : (
                    <p className="text-black dark:text-white">None</p>
                  )
                }
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-zinc-500 text-left md:text-right lg:text-right">Next</p>
                {
                  nextPost ? (
                    <a className="blog-link text-dark dark:text-white" href={`/${nextPost.id}`}>
                      <p>{nextPost.properties.Page.title[0].plain_text}</p>
                    </a>
                  ) : (
                    <p className="text-black dark:text-white">None</p>
                  )
                }
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <Link href="/">
                <button className="blog-btn w-full md:w-28 lg:w-28 xl:w-28 font-bold" aria-label="Go to Root Page">
                  Home
                </button>
              </Link>
            </div>
          </div>
        </section>
      </article>

      <footer>
        <div className="mt-44 pt-8 pb-12 text-sm text-center text-black dark:text-white">
          (C) 2022. Icednut All rights reserved.
        </div>
      </footer>
    </>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(databaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const posts = await getDatabase(databaseId);
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  const currentPostIndex = posts.findIndex((post) => post.id == id);
  let previousPost = null;
  let nextPost = null;

  if (currentPostIndex || currentPostIndex === 0) {
    if (currentPostIndex == 0) {
      nextPost = posts[currentPostIndex + 1];
    } else if (currentPostIndex == posts.length - 1) {
      previousPost = posts[currentPostIndex - 1];
    } else {
      nextPost = posts[currentPostIndex + 1];
      previousPost = posts[currentPostIndex - 1];
    }
  }

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
      previousPost,
      nextPost
    },
    revalidate: 1,
  };
};
