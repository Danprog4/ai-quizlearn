import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, ArrowRight, Trophy } from "lucide-react";
import { cn } from "../../lib/utils";
import type { QuizResponse } from "../../server/main/main";

interface QuizSectionProps {
  quizData: QuizResponse;
  currentQuestion: number;
  correctCount: number;
  answers: { questionId: number; selected: number; correct: boolean }[];
  selectedAnswer: number | null;
  showResult: boolean;
  handleAnswerSelect: (index: number) => void;
  handleConfirmAnswer: () => void;
  handleNextQuestion: () => void;
}

export function QuizSection({
  quizData,
  currentQuestion,
  correctCount,
  answers,
  selectedAnswer,
  showResult,
  handleAnswerSelect,
  handleConfirmAnswer,
  handleNextQuestion,
}: QuizSectionProps) {
  const currentQ = quizData.questions[currentQuestion];
  if (!currentQ) return null;

  return (
    <motion.div
      key="quiz"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full">
      {/* Progress bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs md:text-sm font-medium text-white/60">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span className="text-xs md:text-sm font-bold text-indigo-400">
            {correctCount} / {answers.length} correct
          </span>
        </div>
        <div className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-indigo-600 to-indigo-400"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 backdrop-blur-sm">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] md:text-xs font-bold">
                Q{currentQuestion + 1}
              </span>
              {currentQuestion >= 3 && (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] md:text-xs font-bold">
                  Hard
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5 md:space-y-3 mb-6 md:mb-8">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctAnswer;
              const showCorrectness = showResult;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  className={cn(
                    "w-full p-4 md:p-5 rounded-xl md:rounded-2xl text-left transition-all duration-200 border",
                    !showResult &&
                      !isSelected &&
                      "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20",
                    !showResult &&
                      isSelected &&
                      "bg-indigo-500/20 border-indigo-500/50",
                    showCorrectness &&
                      isCorrect &&
                      "bg-green-500/20 border-green-500/50",
                    showCorrectness &&
                      isSelected &&
                      !isCorrect &&
                      "bg-red-500/20 border-red-500/50"
                  )}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <span
                      className={cn(
                        "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shrink-0 transition-colors",
                        !showResult &&
                          !isSelected &&
                          "bg-white/10 text-white/60",
                        !showResult &&
                          isSelected &&
                          "bg-indigo-500 text-white",
                        showCorrectness &&
                          isCorrect &&
                          "bg-green-500 text-white",
                        showCorrectness &&
                          isSelected &&
                          !isCorrect &&
                          "bg-red-500 text-white"
                      )}>
                      {showCorrectness ? (
                        isCorrect ? (
                          <CheckCircle2 size={16} />
                        ) : isSelected ? (
                          <XCircle size={16} />
                        ) : (
                          String.fromCharCode(65 + index)
                        )
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    <span className="text-white/90 font-medium text-sm md:text-base">
                      {option}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence mode="popLayout">
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  marginBottom: 24,
                }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden rounded-xl md:rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                <div className="p-4 md:p-5 flex items-start gap-3">
                  <Sparkles
                    className="text-indigo-400 mt-0.5 shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="text-[11px] md:text-xs font-bold text-indigo-400 mb-1 uppercase tracking-wider">
                      Explanation
                    </p>
                    <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex justify-end gap-3">
            {!showResult ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedAnswer === null}
                className={cn(
                  "w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl font-bold transition-all text-sm md:text-base",
                  selectedAnswer !== null
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                )}>
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 text-sm md:text-base">
                {currentQuestion < quizData.questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    See Results
                    <Trophy size={16} />
                  </>
                )}
              </button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

