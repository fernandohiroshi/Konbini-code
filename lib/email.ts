"use server";

import { Resend } from "resend";
import { z } from "zod";
import { createFormSchema, type TFunc } from "./schemas";
import { EmailTemplate } from "@/components/email-template";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;

function sanitize(input: string, max = 2000): string {
  const trimmed = input.trim().replace(/\s+/g, " ").replace(/[\u0000-\u001F\u007F]/g, "");
  return trimmed.slice(0, max);
}

export const send = async (emailFormData: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) => {
  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") || hdrs.get("x-real-ip") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, firstRequest: now };
  if (now - entry.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
  } else {
    if (entry.count >= RATE_LIMIT) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    rateLimitMap.set(ip, { count: entry.count + 1, firstRequest: entry.firstRequest });
  }

  try {
    const tv = (await getTranslations("Validation")) as unknown as TFunc;
    const schema = createFormSchema(tv);
    const parsed = schema.parse(emailFormData) as z.infer<typeof schema>;

    const safe = {
      firstName: sanitize(parsed.firstName, 50),
      lastName: sanitize(parsed.lastName, 50),
      email: sanitize(parsed.email, 254),
      message: sanitize(parsed.message, 2000),
    };

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [process.env.EMAIL_TO!],
      subject: "Novo contato pelo site!",
      react: EmailTemplate({
        firstName: safe.firstName,
        lastName: safe.lastName,
        email: safe.email,
        message: safe.message,
      }) as React.ReactNode,
    });

    if (error) {
      throw new Error("EMAIL_SEND_FAILED");
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "UNKNOWN_ERROR";
    if (msg === "RATE_LIMIT_EXCEEDED") {
      throw new Error("Erro ao enviar e-mail.");
    }
    throw new Error("Erro ao enviar e-mail.");
  }
};
