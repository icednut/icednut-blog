export default function BlogFooter({}) {
    return (
      <footer className="grid grid-cols-1 gap-3 justify-center pt-24 pb-12 text-sm text-black dark:text-white">
        <p className="text-center">(C) 2022. Icednut All rights reserved.</p>
        <p className="text-center">Powered by <a className="blog-link" href="https://notion.so">Notion</a> and <a className="blog-link" href="https://nextjs.org">Next.js</a></p>
      </footer>
    );
}