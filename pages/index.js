import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text, getTags, getThumbnailUrl } from "./[id].js";
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

        <ol className={styles.posts + " px-2"}>
          {posts.filter((post) => post.properties.Published.checkbox).map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              "ko-KR",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            );

            const tags = getTags(post);
            const thumbnailUrl = getThumbnailUrl(post);

            return (
              <li key={post.id} className="flex flex-row gap-4 content-center mb-12">
                <div className="flex-none">
                  <p className="text-medium text-sm text-neutral-500 pb-2">{date}</p>
                </div>
                <div className="shrink">
                  <h3 className="pb-1">
                    <Link href={`/${post.id}`}>
                      <a className="font-extrabold text-lg text-black">
                        <Text text={post.properties.Page.title} />
                      </a>
                    </Link>
                  </h3>
                  <p className="text-sm text-neutral-500 pb-2.5 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce velit tortor, dictum in gravida nec, aliquet non lorem. Donec vestibulum justo a diam ultricies pellentesque. Quisque mattis diam vel lacus tincidunt elementum.
                  </p>
                  {/* <p className="">
                    {tags.map(tag => (<span className="post-tag text-xs">#{tag}</span>))}
                  </p> */}
                  <div>
                    <Link href={`/${post.id}`}>
                      <button className="blog-btn">Read more</button>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
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
