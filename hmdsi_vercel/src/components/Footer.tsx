import { Link } from 'react-router-dom';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/hmdsi-fit-telkom-university/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/officialhmdsi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@officialhmdsi',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const footerLinks = [
  {
    title: 'Navigate',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Structure', to: '/structure' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/hmdsi-fit-telkom-university/' },
      { label: 'Instagram', href: 'https://www.instagram.com/officialhmdsi' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@officialhmdsi' },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-[#030010] pt-20 md:pt-28 pb-6 border-t border-white/5">
      <div className="editorial-container">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/10 pb-16 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-4 group mb-4">
              <img src="/images/hmdsi.svg" alt="HMDSI" className="w-14 h-14 md:w-16 md:h-16" />
              <div>
                <h2 className="text-4xl md:text-5xl font-sans font-black tracking-tight text-white leading-none">
                  HMDSI
                </h2>
                <p className="font-sans text-xs md:text-sm text-white/40 mt-1 tracking-wide">
                  Himpunan Mahasiswa Diploma Sistem Informasi
                </p>
              </div>
            </Link>
            {/* 
            <p className="font-sans italic text-white/40 text-lg md:text-xl max-w-md mt-4">
              FIT Telkom University
            </p>
            */}
          </div>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                id={`footer-social-${social.label.toLowerCase()}`}
                className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white bg-white/5 hover:bg-[#0200B5]/20 rounded-full transition-all duration-300 border border-white/5 hover:border-[#0200B5]/30"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 font-sans mb-16">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-6">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {'to' in link ? (
                      <Link
                        to={link.to!}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-300 link-hover inline-block"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/60 hover:text-white transition-colors duration-300 link-hover inline-block"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/30 mb-6">
              Info
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Himpunan Mahasiswa Diploma Sistem Informasi<br />
              Fakultas Ilmu Terapan<br />
              Telkom University
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
          <p className="text-[10px] md:text-xs font-sans font-medium tracking-[0.15em] uppercase text-white/20">
            © 2026 HMDSI. All rights reserved.
          </p>

          <a
            href="https://xer.me"
            target="_blank"
            rel="noopener noreferrer"
            id="powered-by-xerme"
            className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors duration-300 group"
          >
            <span className="text-[10px] md:text-xs font-sans font-medium tracking-[0.15em] uppercase">
              Powered by
            </span>
            <img
              src="/images/xerme.svg"
              alt="xerme"
              className="h-3.5 md:h-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
