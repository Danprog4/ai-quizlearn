import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  Zap,
  Lock,
  Crown,
  BarChart3,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { QuizResponse } from "../../server/main/main";
import { useNavigate } from "@tanstack/react-router";

interface RecapSectionProps {
  quizData: QuizResponse;
  correctCount: number;
  answers: { questionId: number; selected: number; correct: boolean }[];
  scorePercentage: number;
  handleRestartQuiz: () => void;
}

export function RecapSection({
  quizData,
  correctCount,
  answers,
  scorePercentage,
  handleRestartQuiz,
}: RecapSectionProps) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate({ to: "/sign-in/$" });
  };

  return (
    <motion.div
      key="recap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-8">
      {/* Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center p-6 md:p-10 rounded-2xl md:rounded-3xl bg-linear-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Trophy className="w-8 h-8 md:w-12 md:h-12 text-white" />
        </motion.div>

        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
          {scorePercentage >= 80
            ? "Amazing!"
            : scorePercentage >= 60
              ? "Good job!"
              : "Keep learning!"}
        </h2>

        <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400 mb-4">
          {scorePercentage}%
        </div>

        <p className="text-sm md:text-base text-white/60">
          You got{" "}
          <span className="text-white font-bold">{correctCount}</span>{" "}
          out of{" "}
          <span className="text-white font-bold">
            {quizData.questions.length}
          </span>{" "}
          questions correct
        </p>
      </motion.div>

      {/* Question Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-sm">
        <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target size={18} className="text-indigo-400" />
          Question Breakdown
        </h3>
        <div className="space-y-3">
          {quizData.questions.map((question, index) => {
            const answer = answers[index];
            const correctOption =
              question.options[question.correctAnswer];
            return (
              <div
                key={question.id}
                className={cn(
                  "p-3 md:p-4 rounded-xl border",
                  answer?.correct
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                )}>
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      answer?.correct ? "bg-green-500" : "bg-red-500"
                    )}>
                    {answer?.correct ? (
                      <CheckCircle2 size={12} className="text-white" />
                    ) : (
                      <XCircle size={12} className="text-white" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 font-medium text-xs md:text-sm leading-tight md:leading-normal">
                      Q{index + 1}: {question.question}
                    </p>
                    {!answer?.correct && correctOption && (
                      <p className="text-[10px] md:text-xs text-white/50 mt-1">
                        Correct: {correctOption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Ready to Continue? */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-6 md:p-8 rounded-2xl md:rounded-3xl bg-linear-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 backdrop-blur-sm">
        <Zap className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 text-yellow-400" />
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">
          Ready to level up?
        </h3>
        <p className="text-sm md:text-base text-white/60 mb-6">
          Create an account to track progress, compete on leaderboards,
          and unlock more quizzes!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSignIn}
            className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 text-sm md:text-base">
            <Lock size={16} />
            Sign up to continue
          </button>
          <button
            onClick={handleRestartQuiz}
            className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl bg-white/10 text-white/80 font-bold transition-all hover:bg-white/20 text-sm md:text-base">
            Try another quiz
          </button>
        </div>
      </motion.div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leaderboard Coming Soon */}
        <div className="relative p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-orange-500/5" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base">Leaderboard</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400/80">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/50">
              Compete with others and climb the global rankings. Show
              off your knowledge!
            </p>
            <div className="mt-4 space-y-2 opacity-30">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-1.5 md:p-2 rounded-lg bg-white/5">
                  <span className="w-6 text-center text-[10px] md:text-xs font-bold text-yellow-400">
                    #{i}
                  </span>
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20" />
                  <div className="h-2.5 md:h-3 bg-white/10 rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Stats Coming Soon */}
        <div className="relative p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-blue-500/5" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm md:text-base">Your Stats</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/50">
              Track your progress, see weak spots, and watch your skills
              improve over time.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 opacity-30">
              {["Quizzes", "Accuracy", "Streak"].map((stat) => (
                <div
                  key={stat}
                  className="p-2 md:p-3 rounded-lg bg-white/5 text-center">
                  <div className="text-sm md:text-lg font-bold text-white/20">
                    --
                  </div>
                  <div className="text-[8px] md:text-[10px] text-white/30 uppercase">
                    {stat}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

