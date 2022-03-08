import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text, getPostingDate, getTags, getThumbnailUrl } from "./[id].js";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

const getExtraContentUrl = (post) => {
  if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
    return "";
  }
  var extraContentUrl;
  switch (post.properties.cms.select.name) {
    case "velog":
      extraContentUrl = post.properties.extra_contents.rich_text[0].href;
      break;
    default:
      break;
  }
  return extraContentUrl;
};

const getPostPrviewDom = (post) => {
  const extraContentUrl = getExtraContentUrl(post);
  var postPreview;
  
  if (!extraContentUrl) {
    postPreview = (
      <p className="text-sm text-neutral-500 leading-relaxed cursor-pointer">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
      </p>
    );
  } else {
    postPreview = (<></>);
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

      <main>
        <header className={styles.header}>
          <div className={styles.logos}>
            Icednut's Space
          </div>
          <p>리뉴얼 준비 중 입니다.</p>
        </header>

        <div className="grid grid-cols-1 divide-y divide-slate-200 gap-8">
          <div>
            <ol className="list-none p-6 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
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
                var postDom;

                switch (index) {
                  case 0:
                    postDom = (
                      <li key={post.id} className="col-span-full flex flex-col gap-3 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-neutral-500">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={`/${post.id}`}>
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
                      <li key={post.id} className="flex flex-col gap-3 content-center">
                        <div className="flex-none">{postThumbnail}</div>
                        <div className="flex-none">
                          <p className="text-medium text-xs text-neutral-500">{date}</p>
                        </div>
                        <div className="flex-none">
                          <h3>
                            <Link href={`/${post.id}`}>
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
            <ol className="list-none p-6 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

                return (
                  <li key={post.id} className="flex flex-col gap-3 content-center">
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={`/${post.id}`}>
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
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
