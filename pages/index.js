// import Head from "next/head";
// import Link from "next/link";
// import ReactGA from 'react-ga';
// import { useEffect } from "react";
// import { getDatabase, getPostingDate, getTagCloud } from "../lib/notion";
// import { Text, getTags, getThumbnailUrl } from "./post/[id].js";
// import BlogHeader from "../components/header";
// import BlogFooter from "../components/footer";

// export const databaseId = process.env.NOTION_DATABASE_ID;
//
// const getExtraContentUrl = (post) => {
//   if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
//     return `/post/${post.id}`;
//   }
//   var extraContentUrl;
//   switch (post.properties.cms.select.name) {
//     case "velog":
//       extraContentUrl = post.properties.extra_contents.rich_text[0].href;
//       break;
//     default:
//       extraContentUrl = `/post/${post.id}`;
//       break;
//   }
//   return extraContentUrl;
// };
//
// const getPostPrviewDom = (post) => {
//   var postType = 'default';
//   var postPreview = (<div className="invisible"></div>);
//
//   if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
//     postType = 'default';
//   } else {
//     postType = post.properties.cms.select.name;
//   }
//
//   switch (postType) {
//     case "velog":
//       break;
//     default:
//       const previewText = (post.previews && post.previews.length > 0) ? post.previews.join(" ") : "";
//       postPreview = (
//         <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
//           {previewText}
//         </p>
//       );
//       break;
//   }
//   return postPreview;
// };
//
// const getPostThumbnail = (post) => {
//   const thumbnailUrl = getThumbnailUrl(post);
//   var postThumbnail = (
//     <Link href={`/post/${post.id}`}>
//       <div className="w-full h-64 cursor-pointer bg-cover bg-center" style={{backgroundImage: "url(" + thumbnailUrl + ")"}} />
//     </Link>
//   );
//
//   if (!post.properties || !post.properties.cms || !post.properties.cms.select || !post.properties.cms.select.name) {
//     return postThumbnail;
//   }
//
//   const extraContentUrl = getExtraContentUrl(post);
//
//   switch (post.properties.cms.select.name) {
//     case "velog":
//       postThumbnail = (
//         <Link href={extraContentUrl}>
//           <div className="bg-slate-200 flex flex-col justify-center h-64 cursor-pointer">
//             <div className="text-6xl md:text-8xl lg:text-8xl text-slate-600 text-center">Velog</div>
//           </div>
//         </Link>
//       );
//       break;
//     default:
//       break;
//   }
//   return postThumbnail;
// };
//
// export default function Home({ posts, tagCloud, gaid }) {
//   useEffect(() => {
//     if (gaid) {
//       ReactGA.initialize(gaid);
//       ReactGA.pageview(window.location.pathname + window.location.search);
//     }
//   }, []);
//
//   return (
//     <>
//       <Head>
//         <title>Icednut's Space</title>
//         <link rel="icon" href="/favicon.ico" />
//         <meta name="description" content="Welcome to Icednut's Space! This is my coding training blog. (e.g. Scala, Functional Programming)" />
//         <meta name="keywords" content="Scala, Kotlin, Functional Programming" />
//         <meta author="icednut" />
//         <meta name="og:site_name" content="Icednut's Space" />
//         <meta name="og:title" content="Icednut's Space" />
//         <meta name="og:description" content="Welcome to Icednut's Space! This is my coding training blog. (e.g. Scala, Functional Programming)" />
//         <meta name="og:type" content="website" />
//       </Head>
//
//       <BlogHeader/>
//
//       <main className="px-4">
//         <div className="max-w-screen-xl mx-auto">
//           <div id="page-title" className="grid grid-cols-1 items-center content-center gap-6 px-6 py-36 break-normal">
//             <h1 className="text-4xl font-bold text-center text-black dark:text-white special-elite">Blog</h1>
//             <div id="tags" className="flex flex-row flex-wrap gap-3 px-4 justify-center cafe24-ohsquare-air">
//               {
//                 Object.keys(tagCloud).map(tag => {
//                   return (
//                     <div className="flex flex-row flex-wrap gap-1 text-sm align-bottom px-0.5">
//                       <p className="blog-link text-black dark:text-white">#{tag}</p>
//                       {
//                         tagCloud[tag] > 1 ?
//                           (<p className="bg-sky-700 text-white rounded-full px-1 text-xs h-4">{tagCloud[tag]}</p>) :
//                           (<p className="hidden"></p>)
//                       }
//                     </div>
//                   );
//                 })
//               }
//             </div>
//           </div>
//           <div id="recent_posts" className="mb-24">
//             <div className="flex gap-2 pb-1 mb-8 items-center">
//               <p className="flex-none text-xs text-zinc-600 dark:text-zinc-500 cafe24-ohsquare-air">Recent Posts</p>
//               <div className="h-0.5 w-full border-b border-zinc-300 dark:border-zinc-500"></div>
//             </div>
//             <ol className="px-2 list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
//               {posts.filter((post, index) => index <= 4).map((post, index) => {
//                 const date = getPostingDate(post);
//                 const tags = getTags(post);
//                 const postThumbnail = getPostThumbnail(post);
//                 const postPreview = getPostPrviewDom(post);
//                 const postUrl = getExtraContentUrl(post);
//                 let postDom;
//
//                 switch (index) {
//                   case 0:
//                     postDom = (
//                       <li key={post.id} className="col-span-full flex flex-col gap-2 content-center mb-6">
//                         <div className="flex-none">{postThumbnail}</div>
//                         <div className="flex-none">
//                           <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
//                         </div>
//                         <div className="flex-none">
//                           <Link href={postUrl}>
//                             <p className="font-bold text-lg text-black dark:text-white cursor-pointer cafe24-ohsquare-air">
//                               <Text text={post.properties.Page.title} />
//                             </p>
//                           </Link>
//                         </div>
//                         <div className="shrink">{postPreview}</div>
//                         <div className="flex-none">
//                           {tags}
//                         </div>
//                       </li>
//                     )
//                     break;
//                   default:
//                     postDom = (
//                       <li key={post.id} className="flex flex-col gap-2 content-center mb-6">
//                         <div className="flex-none">{postThumbnail}</div>
//                         <div className="flex-none">
//                           <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
//                         </div>
//                         <div className="flex-none">
//                           <Link href={postUrl}>
//                             <p className="font-bold text-lg text-black dark:text-white cursor-pointer cafe24-ohsquare-air">
//                               <Text text={post.properties.Page.title} />
//                             </p>
//                           </Link>
//                         </div>
//                         <div className="shrink">{postPreview}</div>
//                         <div className="flex-none">{tags}</div>
//                       </li>
//                     )
//                     break;
//                 }
//                 return postDom;
//               })}
//             </ol>
//           </div>
//           <div id="all_posts">
//             <div className="flex gap-2 pb-1 mb-8 items-center">
//               <p className="flex-none text-xs text-zinc-600 dark:text-zinc-500 cafe24-ohsquare-air">All Posts ({posts.length - 5})</p>
//               <div className="h-0.5 w-full border-b border-zinc-300 dark:border-zinc-500"></div>
//             </div>
//             <ol className="px-2 list-none grid grid-cols-1 gap-10">
//               {posts.filter((post, index) => index > 4).map((post, index) => {
//                 const date = getPostingDate(post);
//                 const tags = getTags(post);
//                 const postUrl = getExtraContentUrl(post);
//
//                 return (
//                   <li key={post.id} className="flex flex-col gap-2 content-center mb-6">
//                     <div className="flex-none">
//                       <p className="text-medium text-xs text-zinc-700 dark:text-zinc-400">{date}</p>
//                     </div>
//                     <div className="flex-none">
//                       <Link href={postUrl}>
//                         <p className="font-bold text-lg text-black dark:text-white cursor-pointer cafe24-ohsquare-air">
//                           <Text text={post.properties.Page.title} />
//                         </p>
//                       </Link>
//                     </div>
//                     <div className="flex-none">
//                       {tags}
//                     </div>
//                   </li>
//                 );
//               })}
//             </ol>
//             {/* <div className="mt-16 flex flex-row justify-center">
//               <button className="blog-btn w-full md:w-28 lg:w-28 xl:w-28 font-bold" aria-label="Get more posts">
//                 More
//               </button>
//             </div> */}
//           </div>
//         </div>
//       </main>
//
//       <BlogFooter />
//     </>
//   );
// }
//
// export const getStaticProps = async () => {
//   const database = await getDatabase(databaseId);
//   const tagCloud = getTagCloud(database);
//
//   return {
//     props: {
//       posts: database,
//       tagCloud: tagCloud,
//       gaid: process.env.GAID
//     },
//     revalidate: 1,
//   };
// };

export { Home as default } from "@scalajs/Home";
export { getPostList as getStaticProps } from "@scalajs/Posts"
