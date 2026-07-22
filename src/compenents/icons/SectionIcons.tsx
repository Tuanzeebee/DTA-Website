export function TechAreaIcon({ id }: { id: number }) {
  switch (id) {
    case 0:
      // AI & Big Data
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-400/30 flex items-center justify-center p-3 relative group-hover:border-cyan-400/60 transition-colors shadow-lg shadow-cyan-950/20 mb-5">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-cyan-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M24 10C18.5 10 14 14.5 14 20C14 22.8 15.2 25.3 17 27C17 29.5 18 32 20 34C21 35 22.5 36 24 36C25.5 36 27 35 28 34C30 32 31 29.5 31 27C32.8 25.3 34 22.8 34 20C34 14.5 29.5 10 24 10Z"
              opacity="0.4"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <circle cx="24" cy="18" r="3" fill="currentColor" />
            <circle cx="16" cy="22" r="2.5" />
            <circle cx="32" cy="22" r="2.5" />
            <circle cx="19" cy="31" r="2" />
            <circle cx="29" cy="31" r="2" />
            <circle cx="24" cy="38" r="2" fill="currentColor" />
            <line x1="24" y1="18" x2="16" y2="22" strokeDasharray="1 1" />
            <line x1="24" y1="18" x2="32" y2="22" strokeDasharray="1 1" />
            <line x1="16" y1="22" x2="19" y2="31" />
            <line x1="32" y1="22" x2="29" y2="31" />
            <line x1="19" y1="31" x2="24" y2="38" />
            <line x1="29" y1="31" x2="24" y2="38" />
            <line x1="24" y1="18" x2="24" y2="38" opacity="0.5" />
            <circle cx="8" cy="14" r="1.5" className="animate-pulse" />
            <circle cx="40" cy="14" r="1.5" className="animate-pulse" />
            <line x1="10" y1="14" x2="14" y2="16" strokeOpacity="0.5" />
            <line x1="38" y1="14" x2="34" y2="16" strokeOpacity="0.5" />
          </svg>
        </div>
      );
    case 1:
      // Cloud & Blockchain
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-transparent border border-sky-400/30 flex items-center justify-center p-3 relative group-hover:border-sky-400/60 transition-colors shadow-lg shadow-sky-950/20 mb-5">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-sky-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 28C10.7 28 8 25.3 8 22C8 19 10.2 16.5 13.2 16.1C14.4 11.5 18.6 8 23.5 8C29.2 8 33.9 12.3 34.4 17.9C37.5 18.5 40 21.2 40 24.5C40 28 37.3 30.7 33.9 30.9" />
            <rect
              x="13"
              y="28"
              width="9"
              height="9"
              rx="2"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <rect
              x="26"
              y="28"
              width="9"
              height="9"
              rx="2"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path d="M22 32.5H26" strokeWidth="2.5" stroke="currentColor" />
            <path d="M17.5 24V28" strokeDasharray="1 1" />
            <path d="M30.5 24V28" strokeDasharray="1 1" />
          </svg>
        </div>
      );
    case 2:
      // Semiconductors & IC Design
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-teal-500/10 to-transparent border border-amber-400/30 flex items-center justify-center p-3 relative group-hover:border-amber-400/60 transition-colors shadow-lg shadow-amber-950/20 mb-5">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-amber-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="14"
              y="14"
              width="20"
              height="20"
              rx="3"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <rect
              x="19"
              y="19"
              width="10"
              height="10"
              rx="1.5"
              fill="currentColor"
              fillOpacity="0.4"
            />
            <path d="M18 8V14 M24 8V14 M30 8V14" />
            <path d="M18 34V40 M24 34V40 M30 34V40" />
            <path d="M8 18H14 M8 24H14 M8 30H14" />
            <path d="M34 18H40 M34 24H40 M34 30H40" />
            <path
              d="M10 10L14 14 M38 10L34 14 M10 38L14 34 M38 38L34 34"
              strokeOpacity="0.6"
            />
          </svg>
        </div>
      );
    case 3:
      // Robotics, Automation & IoT
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-400/30 flex items-center justify-center p-3 relative group-hover:border-emerald-400/60 transition-colors shadow-lg shadow-emerald-950/20 mb-5">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-emerald-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="12"
              y="16"
              width="24"
              height="18"
              rx="5"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <circle cx="19" cy="24" r="2.5" fill="currentColor" />
            <circle cx="29" cy="24" r="2.5" fill="currentColor" />
            <path d="M20 30H28" />
            <path d="M24 16V10" />
            <circle cx="24" cy="8" r="2" fill="currentColor" />
            <path
              d="M18 6C20 4.5 28 4.5 30 6"
              strokeOpacity="0.6"
              strokeDasharray="2 2"
            />
            <path d="M14 3.5C18 1.5 30 1.5 34 3.5" strokeOpacity="0.4" />
            <path d="M18 34L16 40H32L30 34" />
          </svg>
        </div>
      );
    case 4:
      // Cybersecurity & Infrastructure
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent border border-blue-400/30 flex items-center justify-center p-3 relative group-hover:border-blue-400/60 transition-colors shadow-lg shadow-blue-950/20 mb-5">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-blue-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M24 8L38 13V23C38 32 32 38 24 41C16 38 10 32 10 23V13L24 8Z"
              fill="currentColor"
              fillOpacity="0.12"
            />
            <rect
              x="18"
              y="22"
              width="12"
              height="10"
              rx="2"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path d="M21 22V18C21 16.3 22.3 15 24 15C25.7 15 27 16.3 27 18V22" />
            <circle cx="24" cy="27" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

export function PledgeIcon({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      // Policy Advocacy Bridge / Cầu nối chính sách
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent border border-cyan-400/30 flex items-center justify-center p-3 relative shadow-lg shadow-cyan-950/20 mb-4">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-cyan-400"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Capitol / Policy dome & columns with tech nodes */}
            <path
              d="M24 6L8 15V18H40V15L24 6Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <path d="M12 18V32" />
            <path d="M20 18V32" />
            <path d="M28 18V32" />
            <path d="M36 18V32" />
            <path d="M8 32H40V36H8V32Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M16 40H32" strokeWidth="2" />
            <circle cx="24" cy="11" r="2" fill="currentColor" />
            <path d="M24 6V3" strokeWidth="1.5" />
          </svg>
        </div>
      );
    case 1:
      // Legal & Copyright Shield / Bảo vệ pháp lý & Sở hữu trí tuệ
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/25 via-yellow-500/10 to-transparent border border-amber-400/40 flex items-center justify-center p-3 relative shadow-lg shadow-amber-950/30 mb-4">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-amber-300"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Cyber Shield with IP Keyhole */}
            <path
              d="M24 6L38 11V22C38 31.5 32 38.5 24 42C16 38.5 10 31.5 10 22V11L24 6Z"
              fill="currentColor"
              fillOpacity="0.15"
            />
            <circle
              cx="24"
              cy="21"
              r="4"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path d="M24 25V31" strokeWidth="2.5" />
            <path d="M20 31H28" strokeWidth="2" />
            <circle cx="24" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    case 2:
      // Strategic Alliances / Cơ hội liên minh Viện - Trường - Doanh nghiệp
      return (
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 via-emerald-500/10 to-transparent border border-teal-400/30 flex items-center justify-center p-3 relative shadow-lg shadow-teal-950/20 mb-4">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-full h-full text-teal-300"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 3 Node Network Alliance */}
            <circle
              cx="24"
              cy="12"
              r="5"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <circle
              cx="12"
              cy="34"
              r="5"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <circle
              cx="36"
              cy="34"
              r="5"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <line x1="24" y1="17" x2="12" y2="29" strokeWidth="2" />
            <line x1="24" y1="17" x2="36" y2="29" strokeWidth="2" />
            <line x1="17" y1="34" x2="31" y2="34" strokeWidth="2" />
            <circle cx="24" cy="25" r="3" fill="currentColor" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

// Helper for professional vector SVG icons for 4 Program Pillars
export function PillarIcon({ idx }: { idx: number }) {
  switch (idx) {
    case 0:
      // Advocacy
      return (
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center p-2 text-cyan-400 mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 9h8" />
            <path d="M8 13h6" />
          </svg>
        </div>
      );
    case 1:
      // Trade Promotion
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center p-2 text-sky-400 mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
      );
    case 2:
      // Training & Startups
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center p-2 text-amber-400 mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        </div>
      );
    case 3:
      // Legal Defense
      return (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center p-2 text-indigo-400 mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}
