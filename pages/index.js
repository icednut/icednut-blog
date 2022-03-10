import Head from "next/head";
import Link from "next/link";
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
        <p className="text-base text-neutral-400 leading-relaxed">
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
  return (
    <div>
      <Head>
        <title>Icednut's Space</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="px-4">
        <header>
          <div className="fixed px-8 py-5 inset-x-0 bg-white drop-shadow-md flex flex-row justify-between">
            <Link href="/">
              <p className="post-content-title cursor-pointer">Icednut's Space</p>
            </Link>
            <div className="flex flex-row gap-5">
              <p className="">About</p>
              <Link href="/">
                <p className="cursor-pointer">Blog</p>
              </Link>
              <p className="">Life</p>
            </div>
          </div>
          <div className="h-28"></div>
        </header>

        <div className="grid grid-cols-1 gap-24">
          <div className="h-52 grid grid-cols-1 items-center content-center gap-4 px-6 break-normal">
            <h1 className="text-2xl text-center">Blog</h1>
            <p className="text-base text-neutral-400 leading-relaxed text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div>
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
                var postDom;

                switch (index) {
                  case 0:
                    postDom = (
                      <li key={post.id} className="col-span-full flex flex-col gap-2 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-zinc-700">{date}</p>
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
                          <p className="text-medium text-sm text-zinc-700">{date}</p>
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
          <div>
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
                      <p className="text-medium text-sm text-zinc-700">{date}</p>
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
            <div className="text-center mt-12">
              <button className="blog-btn w-full">More</button>
            </div>
          </div>
          <div>
            <div className="flex gap-2 pb-1 mb-4 items-center">
              <p className="flex-none text-xs text-zinc-400">Tags</p>
              <div className="h-0.5 w-full border-b border-zinc-300"></div>
            </div>
            <div id="tags" className="flex flex-row flex-wrap gap-4 px-4">
              {
                Object.keys(tagCloud).map(tag => {
                  return (
                    <div className="flex flex-row flex-wrap gap-1">
                      <p className="blog-link text-sm">#{tag}</p>
                      {
                        tagCloud[tag] > 1 ? 
                          (<p className="bg-sky-500 text-white rounded-full px-2 text-sm">{tagCloud[tag]}</p>) :
                          (<p className="hidden px-2 text-sm">{tagCloud[tag]}</p>)
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>

        <footer>
          <div className="mt-44 pt-8 pb-12 text-sm text-right">
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
