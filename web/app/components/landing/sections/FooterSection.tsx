"use client";

export function FooterSection() {
  return (
    <div className="mt-62 py-5">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 -m-4 bg-gradient-to-r from-blue-200/20 via-indigo-200/20 to-cyan-200/20 blur-xl rounded-full" />

          <h3 className="relative text-2xl font-serif text-primary/80 tracking-wider">
            Anima <span className="font-light italic text-blue-600/60">OS</span>
          </h3>
        </div>
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-full max-w-md bg-gradient-to-r from-transparent via-blue-300/20 to-transparent blur-md" />
          </div>

          <div className="relative flex items-center justify-center w-full max-w-lg">
            <div className="flex-1 relative">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-indigo-500/50" />
              <div className="absolute top-0 h-px w-full bg-gradient-to-r from-transparent to-blue-300/30 animate-pulse" />
            </div>

            <div className="relative mx-4">
              <div className="absolute inset-0 -m-3 bg-blue-400/20 blur-2xl rounded-full animate-pulse" />{" "}
              <div className="relative flex items-center justify-center w-12 h-12 animate-[spin_30s_linear_infinite]">
                <svg
                  width="45"
                  height="40"
                  viewBox="0 0 90 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-[pulse_3s_ease-in-out_infinite]"
                >
                  <path
                    d="M15.6269 68.8128C13.6835 66.4783 12.2113 64.1987 11.3698 58.9393C11.0295 55.7219 11.6744 52.543 13.2337 49.7456C14.8569 46.8325 17.447 44.3722 20.7221 42.6297C24.2114 40.7744 28.3148 39.7713 32.9166 39.6482C39.6729 36.0907 43.5937 26.5858 45.0013 14.8227C46.4231 26.7023 50.4073 36.2795 57.288 39.7531C61.6888 39.6088 65.611 38.6349 68.9503 36.8593C72.1164 35.1748 74.6197 32.7982 76.1863 29.9859C77.6902 27.2888 78.3107 24.2224 77.9835 21.1173C77.7664 19.0636 77.158 17.0374 76.1666 15.0595C75.0136 12.7581 73.1293 10.8286 70.7825 9.46725C44.4556 -5.80186 -1.7712 32.1906 7.32213 59.88C-22.8146 15.9821 48.1312 -18.6924 74.3739 11.1868C76.3176 13.521 77.7894 15.8006 78.6309 21.0604C78.9712 24.2774 78.3264 27.4567 76.767 30.2541C75.1439 33.1668 72.5537 35.6275 69.279 37.3699C65.789 39.2253 61.6851 40.2286 57.083 40.3515C50.3281 43.9106 46.4085 53.4149 45.0009 65.1763C43.5791 53.297 39.5945 43.7205 32.7152 40.2462C28.313 40.3906 24.3901 41.3645 21.0504 43.14C17.884 44.8248 15.3803 47.2011 13.814 50.0134C12.3101 52.7106 11.6901 55.7769 12.0169 58.882C12.2339 60.9357 12.8423 62.9619 13.8337 64.9402C14.9871 67.2416 16.871 69.1711 19.2179 70.5324C45.5444 85.8015 91.7712 47.8087 82.6779 20.12C112.815 64.0179 41.8688 98.6924 15.6261 68.8131L15.6269 68.8128Z"
                    fill="url(#cosmicGradient)"
                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                  <defs>
                    <linearGradient
                      id="cosmicGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                      <stop
                        offset="50%"
                        stopColor="#3b82f6"
                        stopOpacity="0.9"
                      />
                      <stop
                        offset="100%"
                        stopColor="#1e40af"
                        stopOpacity="0.8"
                      />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="h-px bg-gradient-to-l from-transparent via-blue-400/30 to-indigo-500/50" />
              <div className="absolute top-0 h-px w-full bg-gradient-to-l from-transparent to-blue-300/30 animate-pulse" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${25 + i * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "3s",
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-primary/50 leading-relaxed max-w-2xl mx-auto font-light">
          A platform to create your digital legacy — preserving thoughts,
          memories, and stories that transcend time. Your consciousness,
          eternally woven into the fabric of tomorrow.
        </p>{" "}
        <div className="flex items-center justify-center space-x-6 pt-4 text-xs text-primary/40">
          <a
            href="/about"
            className="hover:text-primary/60 transition-colors cursor-pointer"
          >
            About
          </a>
          <span className="text-primary/20">•</span>
          <span className="hover:text-primary/60 transition-colors cursor-pointer">
            Privacy
          </span>
          <span className="text-primary/20">•</span>
          <span className="hover:text-primary/60 transition-colors cursor-pointer">
            Contact
          </span>
        </div>
      </div>
    </div>
  );
}
