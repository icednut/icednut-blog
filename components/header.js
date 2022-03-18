import { useState, useEffect } from "react";
import Link from "next/link";

export default function BlogHeader() {
  const [isShowMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState("");

  const toggleMenu = () => {
    setShowMenu(!isShowMenu);
  };

  const toggleTheme = () => {
    const themeFromLocalStorage = localStorage.getItem("icednut-theme");

    if (themeFromLocalStorage === 'dark') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem("icednut-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem("icednut-theme", "dark");
      setTheme("dark");
    }
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("icednut-theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");

    document.documentElement.classList.add(currentTheme);
    setTheme(currentTheme);
  }, []);

  return (
      <header>
        <div className="fixed px-8 py-5 inset-x-0 bg-white dark:bg-black drop-shadow-md flex flex-col gap-7">
          <div className="flex flex-row justify-between">
            <Link href="/">
              <p className="cafe24-ohsquare cursor-pointer text-black dark:text-white text-lg">Icednut's Space</p>
            </Link>
            <div className="flex flex-row gap-5">
              <div className="hidden md:block lg:block xl:block">
                <div className="flex flex-row gap-10">
                  <div className="flex flex-row gap-4 items-center">
                    <Link href="/about">
                      <p className="font-bold cursor-pointer text-black dark:text-white special-elite">About</p>
                    </Link>
                    <Link href="/">
                      <p className="font-bold cursor-pointer text-black dark:text-white special-elite">Blog</p>
                    </Link>
                    <Link href="/life">
                      <p className="font-bold cursor-pointer text-black dark:text-white special-elite">Life</p>
                    </Link>
                  </div>
                  <div>
                    <button className="cursor-pointer" aria-label="Change Theme for Desktop" onClick={toggleTheme}>
                      {
                        theme === "dark" ?
                          (
                            <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          ) :
                          (
                            <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          )
                      }
                    </button>
                  </div>
                </div>
              </div>
              <div className="block md:hidden lg:hidden xl:hidden">
                <button aria-label="Change Theme for Mobile" onClick={toggleTheme}>
                  {
                    theme === "dark" ?
                      (
                        <svg xmlns="http://www.w3.org/2000/svg" key="sun" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) :
                      (
                        <svg xmlns="http://www.w3.org/2000/svg" key="moon" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )
                  }
                </button>
              </div>
              <div className="block md:hidden lg:hidden xl:hidden" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" key="menu" className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
          </div>
          <div id="mobile_toolbar_menu" className={(isShowMenu ? "flex" : "hidden") + " flex-col gap-5 pl-4"}>
            <Link href="/about">
              <p className="font-bold cursor-pointer text-black dark:text-white special-elite">About</p>
            </Link>
            <Link href="/">
              <p className="font-bold cursor-pointer text-black dark:text-white special-elite">Blog</p>
            </Link>
            <Link href="/life">
              <p className="font-bold cursor-pointer text-black dark:text-white special-elite">Life</p>
            </Link>
          </div>
        </div>
        <div className="h-16"></div>
      </header>
    );
};