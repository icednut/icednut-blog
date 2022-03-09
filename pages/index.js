import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text, getPostingDate, getTags, getThumbnailUrl } from "./[id].js";
import styles from "./index.module.css";

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
        <p className="text-sm text-neutral-400 leading-relaxed cursor-pointer">
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
      <div className="w-full h-64 bg-cover bg-center cursor-pointer" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
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
          <div className="bg-slate-200 grid grid-cols-3 gap-4 place-content-center place-items-center h-64 cursor-pointer">
            <div className="h-28"></div>
            <div className="h-28 text-8xl text-slate-600 text-center">Velog</div>
            <div className="h-28"></div>
          </div>
        </Link>
      );
      break;
    default:
      break;
  }
  return postThumbnail;
};

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Icednut's Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-6">
        <header>
          <div className="fixed px-8 py-3 inset-x-0 bg-white drop-shadow-md flex flex-row justify-between">
            <p className="post-content-title">Icednut's Space</p>
            <div className="flex flex-row gap-4">
              <p className="">About</p>
              <p className="">Blog</p>
            </div>
          </div>
          <div className="h-24"></div>
        </header>

        <div className="grid grid-cols-1 divide-y divide-slate-200">
          <div className="pb-12">
            <ol className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {posts.filter((post) => post.properties.Published.checkbox).filter((post, index) => index <= 2).map((post, index) => {
                const date = new Date(getPostingDate(post)).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                );

                const tags = getTags(post);
                const postThumbnail = getPostThumbnail(post);
                const postPreview = getPostPrviewDom(post);
                const postUrl = getExtraContentUrl(post);
                var postDom;

                switch (index) {
                  case 0:
                    postDom = (
                      <li key={post.id} className="col-span-full flex flex-col gap-2 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-neutral-500">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={postUrl}>
                              <p className="font-bold text-lg text-black cursor-pointer post-title">
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
                          <p className="text-medium text-xs text-neutral-500">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={postUrl}>
                              <p className="font-bold text-lg text-black cursor-pointer post-title">
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
          <div className="pt-6">
            <ol className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.filter((post) => post.properties.Published.checkbox).filter((post, index) => index > 2).map((post, index) => {
                const date = new Date(getPostingDate(post)).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }
                );

                const tags = getTags(post);
                const postPreview = getPostPrviewDom(post);
                const postUrl = getExtraContentUrl(post);

                return (
                  <li key={post.id} className="flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={postUrl}>
                          <p className="font-bold text-lg text-black cursor-pointer post-title">
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
          </div>
        </div>

        <footer>
          <div className="border-t mt-28 pt-8 pb-12 text-sm">
            (C) 2022. Icednut All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  database.sort((post1, post2) => {
    const date1 = new Date(getPostingDate(post1));
    const date2 = new Date(getPostingDate(post2));

    if (date1 > date2) {
      return -1;
    } else if (date1 < date2) {
      return 1;
    } else {
      return 0;
    }
  })

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
