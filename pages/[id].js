import { Fragment } from "react";
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../lib/notion";
import Link from "next/link";
import { databaseId } from "./index.js";
import styles from "./post.module.css";

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
        <h2 className="text-2xl mt-4 mb-1 font-bold">
          <Text text={value.text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="text-xl mt-3 mb-1 font-bold"> 
          <Text text={value.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="text-lg mt-2 mb-1 font-bold">
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
        <pre className={styles.pre + " bg-gray-100 my-2"}>
          <code className={styles.code_block + " p-4 flex flex-wrap leading-tight"} key={id}>
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

        {/* <div>{emoji}</div> */}
      return (
        <pre className="whitespace-pre-line" key={id}>
          {value.text[0].plain_text}
        </pre>
      );
    default:
      return `❌ Unsupported block (${
        type === "unsupported" ? "unsupported by Notion API" : type
      })`;
  }
};

export const getTags = (page) => {
  if (!page.properties || !page.properties.Tags || page.properties.Tags.type != 'multi_select' || !page.properties.Tags.multi_select) {
    return [];
  }

  const tags = page.properties.Tags.multi_select;

  return tags.map(tag => tag.name);
};

const getPostingDate = (page) => {
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

  const tags = getTags(page);
  const postingDate = getPostingDate(page);
  const thumbnailUrl = getThumbnailUrl(page);

  return (
    <div>
      <Head>
        <title>{page.properties.Page.title[0].plain_text}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className="leading-loose">
        <div className="absolute inset-0 text-center py-10 bg-cover bg-center z-20" style={{backgroundImage: "url(" + thumbnailUrl + ")"}}>
        </div>
        <div className="absolute inset-0 bg-black opacity-70 z-20">
        </div>
        <div className="absolute inset-0 z-30">
          <div className="w-4/5 mx-auto text-center text-white pt-28">
            <p>
              {tags.map(tag => (<span className="post-tag text-sm">#{tag}</span>))}
            </p>
            <h1 className="text-4xl font-black leading-relaxed break-words">
              <Text text={page.properties.Page.title} />
            </h1>
            <p className="opacity-60">
              {postingDate}
            </p>
          </div>
        </div>
        <div className="h-screen mb-16">
        </div>
        <div className="fixed top-0 inset-x-0 px-4 py-2 bg-white border-b border-zinc-300">
          <Text text={page.properties.Page.title} />
        </div>
        <section>
          <div id="post-content">
            {blocks.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
          </div>
          <div id="post-footer" className="py-4">
            <Link href="/">
              <button className="blog-btn">Home</button>
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
