export function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label="A Superintendent walking together with hostel children under a warm morning sun"
      className="h-full w-full"
    >
      {/* Sky */}
      <rect x="0" y="0" width="320" height="240" rx="24" fill="#eaf2f4" />

      {/* Sun */}
      <circle cx="248" cy="58" r="34" fill="#e8983a" />
      <circle cx="248" cy="58" r="34" fill="#e8983a" opacity="0.25">
        <animate attributeName="r" values="34;40;34" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Rolling ground */}
      <path d="M0 176C60 150 110 196 170 172C230 148 280 190 320 168V240H0V176Z" fill="#2f6b4f" />
      <path d="M0 196C70 178 120 210 190 192C240 178 290 204 320 188V240H0V196Z" fill="#264f3b" opacity="0.5" />

      {/* Tree */}
      <rect x="52" y="140" width="10" height="42" rx="4" fill="#7a5b43" />
      <circle cx="57" cy="122" r="30" fill="#3f8f5f" />
      <circle cx="34" cy="140" r="20" fill="#3f8f5f" />
      <circle cx="80" cy="140" r="20" fill="#3f8f5f" />

      {/* Adult figure (Superintendent) */}
      <g transform="translate(150,118)">
        <circle cx="0" cy="0" r="14" fill="#c15b3c" />
        <path d="M-16 60C-16 32 -12 18 0 18C12 18 16 32 16 60Z" fill="#c15b3c" />
      </g>

      {/* Child 1 */}
      <g transform="translate(190,150)">
        <circle cx="0" cy="0" r="9" fill="#3e7c8c" />
        <path d="M-10 38C-10 20 -7 12 0 12C7 12 10 20 10 38Z" fill="#3e7c8c" />
      </g>

      {/* Child 2 */}
      <g transform="translate(114,152)">
        <circle cx="0" cy="0" r="9" fill="#e8983a" />
        <path d="M-10 36C-10 19 -7 11 0 11C7 11 10 19 10 36Z" fill="#e8983a" />
      </g>

      {/* Joined hands hint */}
      <path
        d="M134 176C142 182 158 182 166 176"
        stroke="#7a5b43"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M166 176C176 182 190 182 200 178"
        stroke="#7a5b43"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
