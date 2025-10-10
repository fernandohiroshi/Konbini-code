import { z } from "zod";

export type TFunc = (key: string, values?: Record<string, unknown>) => string;

export const createFormSchema = (t: TFunc) =>
  z.object({
    firstName: z
      .string()
      .min(2, { message: t("firstName.min") })
      .max(50, { message: t("firstName.max") }),
    lastName: z
      .string()
      .min(2, { message: t("lastName.min") })
      .max(50, { message: t("lastName.max") }),
    email: z
      .string()
      .email({ message: t("email.invalid") })
      .refine((val) => /@(gmail|outlook)\.com$/i.test(val), {
        message: t("email.domain"),
      }),
    message: z
      .string()
      .min(2, { message: t("message.min") })
      .max(2000, { message: t("message.max") })
      .refine((val) => !/(https?:\/\/|www\.)/i.test(val), {
        message: t("message.noLinks"),
      }),
  });

export type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;
