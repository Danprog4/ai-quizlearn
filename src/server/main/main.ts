import { createServerFn } from "@tanstack/react-start";
import { generateObject, generateText } from "ai";
import { openrouter } from "../ai";
import z from "zod";

export const getData = createServerFn().handler(async () => {
  const { text } = await generateText({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    prompt: "Explain the concept of quantum entanglement.",
  });
  return { text };
});

// Schema for quiz questions
const QuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string(),
});

const QuizResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(QuizQuestionSchema).length(3),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizResponse = z.infer<typeof QuizResponseSchema>;

const generateQuizSchema = z.object({ url: z.string().url() });

export const generateQuiz = createServerFn()
  .inputValidator(generateQuizSchema)
  .handler(async ({ data }) => {
    const { object } = await generateObject({
      model: openrouter.chat("google/gemini-3-flash-preview"),
      schema: QuizResponseSchema,
      prompt: `You are a quiz generator. Based on the documentation URL provided, create a quiz to test understanding of the content.

URL: ${data.url}

Generate exactly 3 multiple-choice questions based on the content of this documentation. Each question should:
1. Test understanding of key concepts
2. Have 4 answer options (only one correct)
3. Include a brief explanation of why the correct answer is right

Make the questions progressively harder from question 1 to 3.

The quiz title should reflect what documentation/topic is being tested.
The description should be a brief overview of what concepts are being tested.`,
    });

    return object;
  });
