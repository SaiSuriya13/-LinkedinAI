"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Draft = {
  content: string;
  grounding?: {
    is_grounded: boolean;
    warnings: string[];
  };
};

type Result = {
  category: string;
  confidence: number;
  confidence_level: string;
  needs_review: boolean;
  alternative_category?: string;
  drafts: Draft[];
};

export default function GeneratorPage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const generatePosts = async () => {
    if (!text.trim()) {
      setError("Please enter a LinkedIn idea or draft.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          tone,
          number_of_drafts: 3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">

      {/* =====================================================
          ATMOSPHERIC BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Deep base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.045),transparent_35%),linear-gradient(135deg,#050507_0%,#08070d_45%,#050710_100%)]" />

        {/* Red atmosphere */}
        <motion.div
          animate={{
            x: [0, 35, -20, 0],
            y: [0, 20, -10, 0],
            scale: [1, 1.08, 0.98, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-red-600/[0.13] blur-[120px]"
        />

        {/* Purple atmosphere */}
        <motion.div
          animate={{
            x: [0, -40, 25, 0],
            y: [0, -20, 35, 0],
            scale: [1, 0.96, 1.08, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-220px] top-[10%] h-[650px] w-[650px] rounded-full bg-purple-700/[0.14] blur-[130px]"
        />

        {/* Blue atmosphere */}
        <motion.div
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.06, 0.97, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-280px] left-[25%] h-[700px] w-[700px] rounded-full bg-blue-700/[0.12] blur-[140px]"
        />

        {/* Soft horizon glow */}
        <div className="absolute bottom-[5%] left-1/2 h-[280px] w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-r from-red-500/[0.04] via-purple-500/[0.07] to-blue-500/[0.05] blur-[100px]" />

        {/* Fine atmospheric highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(0,0,0,0.35)_100%)]" />
      </div>


      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 lg:px-14">

        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold tracking-[-0.02em]"
        >
          LinkedAI
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="
            rounded-full
            border border-white/[0.12]
            bg-white/[0.045]
            px-4 py-2
            text-xs font-medium
            tracking-wide
            text-white/60
            shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.18)]
            backdrop-blur-2xl
          "
        >
          AI LinkedIn Writer
        </motion.div>

      </nav>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-8 md:px-8 md:pt-12">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center"
        >
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
            AI-powered writing
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-white md:text-6xl">
            Create something
            <span className="block bg-gradient-to-r from-white via-white/85 to-white/45 bg-clip-text text-transparent">
              worth sharing.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45 md:text-base">
            Turn your LinkedIn idea or draft into polished posts while
            keeping your original voice and meaning.
          </p>
        </motion.div>


        {/* =====================================================
            MAIN LIQUID GLASS PANEL
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            relative overflow-hidden
            rounded-[34px]
            border border-white/[0.14]
            bg-white/[0.055]
            shadow-[0_40px_120px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]
            backdrop-blur-[32px]
            backdrop-saturate-[150%]
          "
        >

          {/* Liquid glass reflection */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />

          <div className="relative p-6 md:p-10">


            {/* =================================================
                INPUT SECTION
            ================================================= */}

            <div className="mb-8">

              <div className="mb-3 flex items-center justify-between">

                <label className="text-sm font-medium text-white/80">
                  Your LinkedIn idea or draft
                </label>

                <span className="text-xs text-white/35">
                  {text.length} characters
                </span>

              </div>

              <div className="relative">

                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Start with an idea, experience, project, achievement, or rough draft..."
                  className="
                    glass-input
                    min-h-[220px]
                    resize-none
                    px-5 py-5
                    text-[15px]
                    leading-7
                    text-white
                    placeholder:text-white/25
                  "
                />

                {/* Inner reflection */}

                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              </div>

            </div>


            {/* =================================================
                CONTROLS
            ================================================= */}

            <div className="grid gap-5 md:grid-cols-[1fr_auto]">

              <div>

                <label className="mb-3 block text-sm font-medium text-white/80">
                  Writing tone
                </label>

                <div className="relative">

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="
                      glass-select
                      h-14
                      w-full
                      appearance-none
                      rounded-2xl
                      px-5
                      pr-12
                      text-sm
                      text-white
                    "
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Inspirational</option>
                    <option>Technical</option>
                  </select>

                  <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
                    ↓
                  </div>

                </div>

              </div>


              {/* Generate button */}

              <div className="flex items-end">

                <motion.button
                  whileHover={{
                    y: -2,
                    scale: 1.015,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={generatePosts}
                  disabled={loading}
                  className="
                    glass-button
                    h-14
                    min-w-[190px]
                    rounded-2xl
                    px-7
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Posts
                        <span className="text-white/45">→</span>
                      </>
                    )}

                  </span>
                </motion.button>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="
                    mt-5
                    rounded-2xl
                    border border-red-400/20
                    bg-red-500/[0.08]
                    px-4 py-3
                    text-sm
                    text-red-200
                    backdrop-blur-xl
                  "
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>


            {/* =================================================
                LOADING STATE
            ================================================= */}

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >

                  <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-black/[0.12] py-10">

                    <div className="loader" />

                    <p className="mt-5 text-sm text-white/50">
                      Creating your LinkedIn posts...
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                      Analyzing your idea and generating variations
                    </p>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>


        {/* =====================================================
            RESULTS
        ===================================================== */}

        <AnimatePresence>

          {result && !loading && (

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-10"
            >

              {/* Classification */}

              <div
                className="
                  relative overflow-hidden
                  mb-8
                  rounded-[30px]
                  border border-white/[0.12]
                  bg-white/[0.045]
                  p-6
                  shadow-[0_30px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.08)]
                  backdrop-blur-2xl
                "
              >

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="mb-6 flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                      Classification
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {result.category}
                    </h2>
                  </div>

                  <div className="text-right">

                    <p className="text-2xl font-semibold text-white">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {result.confidence_level} confidence
                    </p>

                  </div>

                </div>


                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${result.confidence * 100}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"
                  />

                </div>


                {result.needs_review && (
                  <div className="mt-5 rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.06] px-4 py-3 text-sm text-yellow-100/70">
                    This classification may need review.
                  </div>
                )}

              </div>


              {/* Generated Posts */}

              <div className="mb-5 flex items-end justify-between">

                <div>

                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                    Generated content
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                    Your posts
                  </h2>

                </div>

                <span className="text-xs text-white/30">
                  {result.drafts.length} variations
                </span>

              </div>


              <div className="space-y-5">

                {result.drafts?.map((draft, index) => (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                    }}
                    className="
                      group
                      relative overflow-hidden
                      rounded-[28px]
                      border border-white/[0.11]
                      bg-white/[0.045]
                      p-6
                      shadow-[0_25px_70px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.07)]
                      backdrop-blur-2xl
                      transition-all
                      duration-500
                      hover:border-white/[0.18]
                      hover:bg-white/[0.065]
                    "
                  >

                    {/* Reflection */}

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />

                    <div className="mb-5 flex items-center justify-between">

                      <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-[11px] font-medium text-white/50">
                        Draft {index + 1}
                      </span>

                      {draft.grounding?.is_grounded && (
                        <span className="text-[11px] text-emerald-300/60">
                          ✓ Grounded
                        </span>
                      )}

                    </div>

                    <p className="whitespace-pre-line text-[15px] leading-8 text-white/75">
                      {draft.content}
                    </p>

                  </motion.div>

                ))}

              </div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="mt-12 text-center">

          <p className="text-[11px] tracking-wide text-white/20">
            LinkedAI · Built with Python, FastAPI, Next.js & AI
          </p>

        </div>

      </section>

    </main>
  );
}