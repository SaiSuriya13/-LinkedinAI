"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "✦",
    title: "AI Classification",
    description: "Smart category detection",
  },
  {
    icon: "◈",
    title: "Multiple Drafts",
    description: "Generate different versions",
  },
  {
    icon: "✎",
    title: "4 Writing Tones",
    description: "Professional, Casual & more",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03040a] text-white">

      {/* =====================================================
          AMBIENT LIGHTING
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="ambient-orb ambient-red left-[-160px] top-[-140px] h-[500px] w-[500px]" />

        <div className="ambient-orb ambient-purple right-[-150px] top-[15%] h-[550px] w-[550px]" />

        <div className="ambient-orb ambient-blue bottom-[-180px] left-[30%] h-[600px] w-[600px]" />

        {/* Subtle center glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-purple-600/5
            blur-[140px]
          "
        />
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/20
              bg-white/10
              text-sm
              font-semibold
              shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
              backdrop-blur-xl
            "
          >
            LA
          </div>

          <span className="text-xl font-semibold tracking-tight">
            LinkedAI
          </span>

        </div>

        <div className="glass-soft rounded-full px-5 py-2.5 text-sm text-white/70">
          AI LinkedIn Writer
        </div>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-5 pb-16">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
          className="w-full max-w-5xl"
        >

          {/* =================================================
              MAIN LIQUID GLASS PANEL
          ================================================= */}

          <div
            className="
              glass
              rounded-[42px]
              px-7
              py-14
              md:px-16
              md:py-20
            "
          >

            {/* Hero content */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
                duration: 0.7,
              }}
              className="relative z-10 text-center"
            >

              {/* Eyebrow */}

              <div
                className="
                  mx-auto
                  mb-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/[0.06]
                  px-4
                  py-2
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-white/65
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]
                  backdrop-blur-xl
                "
              >
                <span className="text-red-400">✦</span>
                AI-powered LinkedIn writing
              </div>

              {/* Heading */}

              <h1
                className="
                  text-5xl
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.055em]
                  md:text-7xl
                  lg:text-8xl
                "
              >
                Turn your ideas
                <br />
                into{" "}
                <span className="gradient-text">
                  impact.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mx-auto
                  mt-7
                  max-w-2xl
                  text-base
                  leading-7
                  text-white/55
                  md:text-lg
                  md:leading-8
                "
              >
                Transform your LinkedIn ideas and drafts into
                polished, professional posts with the help of AI.
              </p>

              {/* =================================================
                  CTA
              ================================================= */}

              <motion.button
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                }}
                whileHover={{
                  scale: 1.035,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() => router.push("/generator")}
                className="
                  glass-button
                  accent-button
                  group
                  relative
                  mt-10
                  rounded-full
                  px-9
                  py-4
                  text-sm
                  font-semibold
                "
              >

                <span className="relative z-10 flex items-center gap-3">
                  Start Creating

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>

              </motion.button>

            </motion.div>

            {/* =================================================
                FEATURE CARDS
            ================================================= */}

            <div className="relative z-10 mt-14 grid gap-3 md:grid-cols-3">

              {features.map((feature, index) => (

                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.5,
                  }}
                  className="
                    glass-soft
                    rounded-2xl
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-white/25
                  "
                >

                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] text-white/80">
                    {feature.icon}
                  </div>

                  <h3 className="text-sm font-medium text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/45">
                    {feature.description}
                  </p>

                </motion.div>

              ))}

            </div>

            {/* =================================================
                BOTTOM STATS
            ================================================= */}

            <div className="relative z-10 mt-8">

              <div className="glass-soft grid rounded-3xl p-6 md:grid-cols-3">

                <div className="border-white/10 text-center md:border-r">
                  <div className="text-2xl font-semibold">
                    AI
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    Intelligent writing
                  </p>
                </div>

                <div className="mt-6 border-white/10 text-center md:mt-0 md:border-r">
                  <div className="text-2xl font-semibold">
                    3+
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    Draft variations
                  </p>
                </div>

                <div className="mt-6 text-center md:mt-0">
                  <div className="text-2xl font-semibold">
                    4
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    Writing tones
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="relative z-10 mt-8 text-center text-xs text-white/30">
              Built with Python · FastAPI · Next.js · OpenRouter · scikit-learn
            </div>

          </div>

        </motion.div>

      </section>

    </main>
  );
}