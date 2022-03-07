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

        <ol className="list-none p-4 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.filter((post) => post.properties.Published.checkbox).map((post, index) => {
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
                  <li key={post.id} className="col-span-full flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <img src={thumbnailUrl} />
                    </div>
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={`/${post.id}`}>
                          <p className="font-bold text-lg text-black cursor-pointer">
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
              case 1:
                postDom = (
                  <li key={post.id} className="col-span-full lg:col-span-2 flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
                    </div>
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={`/${post.id}`}>
                          <p className="font-bold text-lg text-black cursor-pointer">
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
              case 2:
                postDom = (
                  <li key={post.id} className="col-span-full lg:col-span-1 flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <div className="h-48 bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
                    </div>
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={`/${post.id}`}>
                          <p className="font-bold text-lg text-black cursor-pointer">
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
              default:
                postDom = (
                  <li key={post.id} className="flex flex-col gap-2 content-center">
                    <div className="flex-none">
                      <p className="text-medium text-xs text-neutral-500">{date}</p>
                    </div>
                    <div className="flex-none">
                      <h3>
                        <Link href={`/${post.id}`}>
                          <p className="font-bold text-lg text-black cursor-pointer">
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
