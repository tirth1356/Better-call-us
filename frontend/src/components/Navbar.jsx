import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ title = "alertX", links, cta }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const defaultLinks = [
    { label: "Home", href: "#home", sectionId: "home" },
    { label: "Temples", href: "#sites", sectionId: "sites" },
    { label: "Features", href: "#features", sectionId: "features" },
  ];
  const navLinks = useMemo(() => links || defaultLinks, [links]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(location.pathname);
      return undefined;
    }

    const sectionIds = navLinks
      .map((link) => link.sectionId)
      .filter(Boolean);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      setActiveSection("home");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    const syncFromScroll = () => {
      const currentSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 140 && rect.bottom >= 140;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncFromScroll);
    };
  }, [location.pathname, navLinks]);

  const isActiveLink = (link) => {
    if (link.sectionId && location.pathname === "/") {
      return activeSection === link.sectionId;
    }

    return location.pathname === link.to;
  };

  return (
    <nav className="sticky top-0 z-[100] px-4 pt-6 sm:px-6 lg:px-10 pointer-events-none">
      <div className="max-w-screen-2xl mx-auto pointer-events-auto">
        <div className="relative overflow-hidden rounded-full premium-glass px-4 py-3 shadow-[0_20px_50px_rgba(75,46,43,0.1)] transition-all duration-500 border border-white/40">
          <div className="relative flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-4 group">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4B2E2B] text-white shadow-xl transition-transform group-hover:rotate-12 group-active:scale-90">
                <span className="material-symbols-outlined text-[1.4rem]">architecture</span>
              </span>
              <div className="min-w-0">
                <span className="block truncate font-headline text-lg font-black tracking-tighter text-[#4B2E2B] leading-none uppercase">AlertX</span>
                <span className="text-[7px] uppercase tracking-[0.4em] font-black text-primary leading-none mt-1 block">Live Intelligence Hub</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 bg-stone-100/50 p-1.5 rounded-full border border-stone-200/50">
              {navLinks.map((link) =>
                link.href ? (
                  <a
                    key={link.sectionId || link.label}
                    href={link.href}
                    className={`rounded-full px-6 py-2.5 font-headline text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-white shadow-lg"
                        : "text-[#4B2E2B]/50 hover:text-[#4B2E2B] hover:bg-white"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-full px-6 py-2.5 font-headline text-[9px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-white shadow-lg"
                        : "text-[#4B2E2B]/50 hover:text-[#4B2E2B] hover:bg-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Link to={cta?.to || "/pavagadh"}>
                  <button className="rounded-full bg-[#4B2E2B] px-8 py-3.5 font-headline text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-[#4B2E2B]/20 transition-all hover:scale-105 active:scale-95">
                    {cta?.label || "Launch Observatory"}
                  </button>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-[#4B2E2B] lg:hidden border border-stone-200 active:scale-90 transition-all"
                aria-label="Toggle navigation menu"
              >
                <span className="material-symbols-outlined text-xl">{isMenuOpen ? "close" : "sort"}</span>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="mt-3 overflow-hidden rounded-[2rem] border border-white/30 bg-[rgba(255,248,241,0.5)] p-3 shadow-[0_20px_45px_rgba(75,46,43,0.12)] backdrop-blur-2xl lg:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.href ? (
                  <a
                    key={link.sectionId || link.label}
                    href={link.href}
                    className={`rounded-[1.3rem] px-4 py-3 font-headline text-xs font-semibold uppercase tracking-[0.22em] transition-colors ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-[#FFF8F1]"
                        : "text-[#4B2E2B]/75 hover:bg-white/35"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-[1.3rem] px-4 py-3 font-headline text-xs font-semibold uppercase tracking-[0.22em] transition-colors ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-[#FFF8F1]"
                        : "text-[#4B2E2B]/75 hover:bg-white/35"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                to={cta?.to || "/ambaji"}
                className="mt-1 rounded-[1.3rem] bg-[#4B2E2B] px-4 py-3 text-center font-headline text-xs font-bold uppercase tracking-[0.22em] text-[#FFF8F1]"
              >
                {cta?.label || "View Analytics"}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
