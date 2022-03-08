import { Fragment, useEffect } from "react";
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../lib/notion";
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
          bold ? styles.bold : "",
          code ? styles.code : "",
          italic ? styles.italic : "",
          strikethrough ? styles.strikethrough : "",
          underline ? styles.underline : "",
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
        <p>
          <Text text={value.text} />
        </p>
      );
    case "heading_1":
      return (
        <h2 className="text-2xl mt-6 mb-1 font-bold">
          <Text text={value.text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="text-xl mt-4 mb-1 font-bold"> 
          <Text text={value.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="text-lg mt-3 mb-1 font-bold">
          <Text text={value.text} />
        </h4>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
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
      //  console.log(emoji, value)

      return (
        <pre className="whitespace-pre-line flex bg-slate-600 text-white font-medium p-4 rounded text-base" key={id}>
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

export const getTags = (page, centerAlign) => {
  if (!page.properties || !page.properties.Tags || page.properties.Tags.type != 'multi_select' || !page.properties.Tags.multi_select) {
    return [];
  }

  const tags = page.properties.Tags.multi_select.map(tag => tag.name);
  const cmsType = getCmsType(page);
  var cmsDom = (<></>);

  if (cmsType) {
    cmsDom = (<div className="rounded text-white bg-sky-600 px-2 py-0.5 text-xs">{cmsType}</div>);
  }

  var centerAlignClass = "";

  if (centerAlign) {
    centerAlignClass = "justify-center";
  }

  return (
    <div className={"flex flex-wrap gap-3 " + centerAlignClass}>
      {cmsDom}
      {tags.map(tag => (<div className="blog-link text-xs">#{tag}</div>))}
    </div>
  );
};

export const getPostingDate = (page) => {
  if (!page.properties || !page.properties.Date || page.properties.Date.type != 'date' || !page.properties.Date.date || !page.properties.Date.date.start) {
    return 'unknown';
  }

  return page.properties.Date.date.start;
};

export const getThumbnailUrl = (page) => {
  if (!page.cover || !page.cover.external || !page.cover.external.url) {
    return ''; // TODO: default image url
  }

  return page.cover.external.url;
};

export default function Post({ page, blocks }) {
  if (!page || !blocks) {
    return <div />;
  }

  const tags = getTags(page, true);
  const postingDate = getPostingDate(page);
  const thumbnailUrl = getThumbnailUrl(page);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.plugins.autoloader.languages_path = '/prism-grammers/';
      Prism.highlightAll();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>{page.properties.Page.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="leading-loose px-6 mb-10">
        <div className="absolute inset-0 text-center py-10 bg-cover bg-center z-20" style={{backgroundImage: "url(" + thumbnailUrl + ")"}}>
        </div>
        <div className="absolute inset-0 bg-black opacity-70 z-20">
        </div>
        <div className="absolute inset-0 z-30">
          <div className="w-4/5 mx-auto text-center text-white pt-28">
            {tags}
            <h1 className="text-4xl font-black leading-relaxed break-words post-title">
              <Text text={page.properties.Page.title} />
            </h1>
            <p className="opacity-60">
              {postingDate}
            </p>
          </div>
        </div>
        <div className="h-screen mb-16">
        </div>
        <div className="fixed top-0 inset-x-0 px-4 py-2 bg-white drop-shadow-md post-title z-10">
          <Text text={page.properties.Page.title} />
        </div>
        <section>
          <div id="post-content" className="line-numbers">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </div>
          <div id="post-footer" className="py-4">
            <Link href="/">
              <a className="blog-link">Home</a>
            </Link>
          </div>
        </section>
      </article>
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
  const page = await getPage(id);
  const blocks = await getBlocks(id);

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
    },
    revalidate: 1,
  };
};
