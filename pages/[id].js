import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import { getDatabase, getPostingDate, getPage, getBlocks } from "../lib/notion";
import Link from "next/link";
import { databaseId } from "./index.js";
import styles from "./post.module.css";
import Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/autoloader/prism-autoloader";
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/show-language/prism-show-language';
import "prismjs/themes/prism-tomorrow.min.css";
import "prismjs/components/prism-java";
import "prismjs/components/prism-scala";

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
          code ? styles.codetext : "",
          italic ? "italic" : "",
          strikethrough ? "line-through" : "",
          underline ? "underline" : "",
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
        <li className="pb-1">
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
      return <blockquote key={id}>{value.text[0].plain_text}</blockquote>;
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
    cmsDom = (<div className="rounded text-white bg-sky-600 px-2 py-0.5">{cmsType}</div>);
  }

  var cssClass = additionalCssClass;

  if (!cssClass) {
    cssClass = "font-bold text-sm";
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

  const tags = getTags(page, "font-bold text-base justify-center");
  const footerTags = getTags(page, "font-bold text-base"); // TODO: 이거 하나로 합치기
  const postingDate = getPostingDate(page);
  const thumbnailUrl = getThumbnailUrl(page);

  const [isVisiblePostTitle, setVisiblePostTitle] = useState(true);
  const togglePostTitle = () => {
    setVisiblePostTitle(!isVisiblePostTitle);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.plugins.autoloader.languages_path = '/prism-grammers/';
      Prism.highlightAll();
    }
  }, []);

  return (
    <div className="px-6">
      <Head>
        <title>{page.properties.Page.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="leading-loose">
        <div className="absolute inset-0 text-center py-10 bg-cover bg-center z-20" style={{backgroundImage: "url(" + thumbnailUrl + ")"}}>
        </div>
        <div className="absolute inset-0 bg-black opacity-70 z-20">
        </div>
        <div className="absolute inset-0 z-30 flex flex-col justify-between">
          <div className="text-white px-6 pt-36 md:px-28 lg:px-28 xl:px-28">
            {tags}
            <h1 className="w-full text-4xl leading-relaxed post-content-title text-center break-normal">
              <Text text={page.properties.Page.title} />
            </h1>
            <p className="text-zinc-400 text-center">
              {postingDate}
            </p>
          </div>
          <div className="text-white py-8">
            <a href="#post-content-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="h-screen">
        </div>
        <div id="post-content-start" className="invisible py-6 flex flex-col md:flex-row lg:flex-row">
          <div className="justify-between">
            <p className="post-content-title flex-none">Icednut's Space</p>
          </div>
          <div className="post-title grow font-bold">
            <Text text={page.properties.Page.title} />
          </div>
        </div>
        <div className="fixed top-0 inset-x-0 px-8 py-5 bg-white drop-shadow-md z-10 flex flex-col md:flex-row lg:flex-row gap-2">
          <div className="flex flex-row justify-between">
            <p className="post-content-title flex-none">Icednut's Space</p>
            <div className="block md:hidden lg:hidden" onClick={togglePostTitle}>
              {
                isVisiblePostTitle ? (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )
              }
            </div>
          </div>
          <p className="hidden md:block lg:block">·</p>
          <div className={`post-title ${isVisiblePostTitle ? 'block' : 'hidden'} grow md:block lg:block font-bold text-slate-500`}>
            <Text text={page.properties.Page.title} />
          </div>
        </div>
        <section>
          <div className="line-numbers">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
            <div className="mt-5">
              <p className="text-sm text-slate-500">Tags:</p>
              {footerTags}
            </div>
            <div className="w-full h-52 mt-6 bg-slate-200 p-4 rounded">comment</div>
          </div>
          <div id="post-footer" className="mt-32 flex flex-col gap-10 justify-center">
            <div className="flex flex-col md:flex-row lg:flex-row justify-between mb-10 gap-4">
              <div className="flex flex-col justify-start">
                <p className="text-sm text-zinc-500">Previous</p>
                {
                  previousPost ? (
                    <Link href={`/${previousPost.id}`}>
                      <a className="blog-link">
                        <p>{previousPost.properties.Page.title[0].plain_text}</p>
                      </a>
                    </Link>
                  ) : (
                    <p>없음</p>
                  )
                }
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-zinc-500 text-left md:text-right lg:text-right">Next</p>
                {
                  nextPost ? (
                    <Link href={`/${nextPost.id}`}>
                      <a className="blog-link">
                        <p>{nextPost.properties.Page.title[0].plain_text}</p>
                      </a>
                    </Link>
                  ) : (
                    <p>없음</p>
                  )
                }
              </div>
            </div>
            <Link href="/">
              <button className="blog-btn">Home</button>
            </Link>
          </div>
        </section>
      </article>

      <footer>
        <div className="mt-44 pt-8 pb-12 text-sm text-center">
          (C) 2022. Icednut All rights reserved.
        </div>
      </footer>
    </div>
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
