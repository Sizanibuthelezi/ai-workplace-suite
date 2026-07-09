import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const EmailInput = z.object({
  recipient: z.string().min(1),
  subject: z.string().min(1),
  purpose: z.string().min(1),
  notes: z.string().optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EmailInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const lengthGuide =
      data.length === "Short"
        ? "under 100 words"
        : data.length === "Medium"
          ? "150-220 words"
          : "300-400 words";
    const prompt = `Write a professional workplace email.
Recipient: ${data.recipient}
Subject: ${data.subject}
Purpose: ${data.purpose}
Additional notes: ${data.notes || "(none)"}
Tone: ${data.tone}
Length: ${data.length} (${lengthGuide})

Output only the email body, starting with a greeting and ending with a sign-off. Do not include the subject line or any preamble.`;
    const { text } = await generateText({
      model: gateway("openai/gpt-5.5"),
      prompt,
    });
    return { email: text };
  });

const PlanInput = z.object({
  goals: z.string(),
  tasks: z.string(),
  meetings: z.string().optional().default(""),
  priority: z.enum(["High", "Medium", "Low"]),
  workStart: z.string(),
  workEnd: z.string(),
  planType: z.enum(["Daily", "Weekly"]),
});

const PlanSchema = z.object({
  items: z.array(
    z.object({
      time: z.string(),
      task: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      duration: z.string(),
      status: z.string(),
    }),
  ),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PlanInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });
    const prompt = `Generate a prioritized ${data.planType.toLowerCase()} work schedule.
Working hours: ${data.workStart} to ${data.workEnd}
Overall priority focus: ${data.priority}
Work goals: ${data.goals}
Tasks: ${data.tasks}
Meetings: ${data.meetings || "(none)"}

Allocate realistic time blocks, include short breaks, and prioritize urgent deadlines. Return 6-12 items. For a Weekly plan, prefix each time with the day (e.g. "Mon 09:00-10:00"). Status should be one of: "Pending", "In Progress", "Scheduled".`;
    try {
      const { output } = await generateText({
        model: gateway("openai/gpt-5.5"),
        output: Output.object({ schema: PlanSchema }),
        prompt,
      });
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return { items: [] };
      }
      throw error;
    }
  });
