export default function Footer({ brand = "Stampede Predictor", tagline = "Precision Engineering by Chronos Observatory. Redefining safety in complex environments." }) {
  return (
    <footer className="w-full py-16 px-6 md:px-10 mt-auto bg-[#fff8f1] border-t border-[#d6c3b6]/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <span className="font-headline font-bold text-[#4B2E2B] text-xl">{brand}</span>
          <p className="font-body text-xs tracking-widest uppercase text-[#4B2E2B]/50 max-w-[300px]">{tagline}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-body text-xs tracking-widest uppercase font-semibold">
          {["Architecture", "Privacy", "API Documentation", "Support"].map((link) => (
            <a key={link} href="#" className="text-[#4B2E2B]/50 hover:text-[#855324] transition-colors duration-200 hover:underline underline-offset-4">{link}</a>
          ))}
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="font-body text-xs tracking-widest uppercase text-[#4B2E2B]/50">© 2024 Stampede Window Predictor.</span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#855324] cursor-pointer hover:scale-110 transition-transform">share</span>
            <span className="material-symbols-outlined text-[#855324] cursor-pointer hover:scale-110 transition-transform">public</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
