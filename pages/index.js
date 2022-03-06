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

        <ol className={styles.posts}>
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
              <li key={post.id} className="flex flex-row gap-4 content-center overflow-hidden rounded shadow-lg mb-4">
                <div className="flex-none w-32 h-32 bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}}>
                </div>
                <div className="shrink my-auto">
                  <h3>
                    <Link href={`/${post.id}`}>
                      <a className="font-extrabold text-lg text-black">
                        <Text text={post.properties.Page.title} />
                      </a>
                    </Link>
                  </h3>
                  <p className="text-medium text-sm text-neutral-500 pb-2">{date}</p>
                  <p className="">
                    {tags.map(tag => (<span className="post-tag text-xs">#{tag}</span>))}
                  </p>
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
