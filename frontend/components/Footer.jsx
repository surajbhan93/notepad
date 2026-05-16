export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-[#050816] py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left */}
        <div className="text-gray-400 text-sm">
          © 2026 Notes App • Built by Surajbhan
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-gray-400">

          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition"
          >
            API Docs
          </a>

          <a
            href="/about"
            className="hover:text-amber-400 transition"
          >
            About
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}