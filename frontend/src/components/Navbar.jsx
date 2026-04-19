import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ title = "Chronos Observatory", links, cta }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const defaultLinks = [
    { label: "Home", href: "#home", sectionId: "home" },
    { label: "Temples", href: "#sites", sectionId: "sites" },
    { label: "Features", href: "#features", sectionId: "features" },
    { label: "Flow", href: "#flow", sectionId: "flow" },
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
    <nav className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="relative overflow-hidden rounded-full border border-white/30 bg-[rgba(255,248,241,0.36)] px-4 py-3 shadow-[0_18px_45px_rgba(75,46,43,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[rgba(255,248,241,0.28)] sm:px-5 lg:px-7">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(255,255,255,0.06)_35%,rgba(192,133,82,0.12)_100%)]" />
          <div className="relative flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/25 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
                <span className="material-symbols-outlined text-[1.6rem]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-headline text-base font-bold tracking-tight text-[#4B2E2B] sm:text-xl">{title}</span>
                <span className="hidden text-[0.6rem] uppercase tracking-[0.32em] text-[#855324]/70 sm:block">Predictive Crowd Systems</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center rounded-full border border-white/25 bg-white/12 px-2 py-2">
              {navLinks.map((link) =>
                link.href ? (
                  <a
                    key={link.sectionId || link.label}
                    href={link.href}
                    className={`rounded-full px-5 py-2 font-headline text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-[#FFF8F1] shadow-[0_10px_24px_rgba(75,46,43,0.18)]"
                        : "text-[#4B2E2B]/72 hover:bg-white/25 hover:text-[#4B2E2B]"
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-full px-5 py-2 font-headline text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${
                      isActiveLink(link)
                        ? "bg-[#4B2E2B] text-[#FFF8F1] shadow-[0_10px_24px_rgba(75,46,43,0.18)]"
                        : "text-[#4B2E2B]/72 hover:bg-white/25 hover:text-[#4B2E2B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            <div className="hidden sm:block">
              <Link to={cta?.to || "/ambaji"}>
                <button className="rounded-full border border-white/35 bg-[#4B2E2B] px-5 py-3 font-headline text-xs font-bold uppercase tracking-[0.22em] text-[#FFF8F1] shadow-[0_16px_30px_rgba(75,46,43,0.22)] transition-transform active:scale-95">
                  {cta?.label || "View Analytics"}
                </button>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/20 text-[#4B2E2B] lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
            </button>
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
