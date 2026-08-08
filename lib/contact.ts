"use server";

import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { aboutBio } from "@/content/about/bio";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendContactMessage(
  _state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const message = getFormString(formData, "message");

  if (!name || !isValidEmail(email) || !message) {
    return {
      status: "error",
      message: aboutBio.contact.error,
    };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      status: "error",
      message: aboutBio.contact.missingConfig,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? `website <onboarding@resend.dev>`;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `message from ${name}`,
      text: [`name: ${name}`, `email: ${email}`, "", message].join("\n"),
    });

    return {
      status: "success",
      message: aboutBio.contact.success,
    };
  } catch {
    return {
      status: "error",
      message: aboutBio.contact.error,
    };
  }
}
