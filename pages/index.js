import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text, getPostingDate, getTags, getThumbnailUrl } from "./[id].js";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

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
                const thumbnailUrl = getThumbnailUrl(post);

                var postDom;
                switch (index) {
                  case 0:
                    postDom = (
                      <li key={post.id} className="col-span-full flex flex-col gap-3 content-center">
                        <div className="flex-none">
                          <Link href={`/${post.id}`}>
                            <img className="cursor-pointer" src={thumbnailUrl} />
                          </Link>
                        </div>
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
                        <div className="shrink">
                          <p className="text-sm text-neutral-500 leading-relaxed cursor-pointer">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
                          </p>
                        </div>
                        <div className="flex-none">
                          <div className="flex flex-wrap gap-3">
                            {tags.map(tag => (<div className="blog-link text-xs">#{tag}</div>))}
                          </div>
                        </div>
                      </li>
                    )
                    break;
                  default:
                    postDom = (
                      <li key={post.id} className="flex flex-col gap-3 content-center">
                        <div className="flex-none">
                          <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
                        </div>
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
                        <div className="shrink">
                          <p className="text-sm text-neutral-500 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
                          </p>
                        </div>
                        <div className="flex-none">
                          <div className="flex flex-wrap gap-3">
                            {tags.map(tag => (<div className="blog-link text-xs">#{tag}</div>))}
                          </div>
                          {/* <div>
                            <Link href={`/${post.id}`}>
                              <button className="blog-btn">Read more</button>
                            </Link>
                          </div> */}
                        </div>
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
                    <div className="shrink">
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
                      </p>
                    </div>
                    <div className="flex-none">
                      <div className="flex flex-wrap gap-3">
                        {tags.map(tag => (<div className="blog-link text-xs">#{tag}</div>))}
                      </div>
                      {/* <div>
                        <Link href={`/${post.id}`}>
                          <button className="blog-btn">Read more</button>
                        </Link>
                      </div> */}
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
