export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  budget?: string;
  /** Honeypot - must stay empty. */
  company?: string;
}

export type ContactErrors = Partial<Record<"name" | "email" | "message" | "projectType", string>>;

/** The submission as a readable WhatsApp / email message. */
export function formatContactMessage(input: Partial<ContactPayload>): string {
  return [
    "*New Portfolio Enquiry*",
    "",
    `*Name:* ${input.name?.trim() ?? ""}`,
    `*Email:* ${input.email?.trim() ?? ""}`,
    `*Project Type:* ${input.projectType || "Not specified"}`,
    `*Budget:* ${input.budget || "Not specified"}`,
    "",
    "*Message:*",
    input.message?.trim() ?? "",
  ].join("\n");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the client form and the API route so both enforce identical rules. */
export function validateContact(input: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (name.length < 2) errors.name = "Please tell me your name.";
  else if (name.length > 100) errors.name = "That name is a little long.";

  if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  else if (email.length > 200) errors.email = "That email is too long.";

  if (message.length < 10) errors.message = "A few more words, please (10+ characters).";
  else if (message.length > 500) errors.message = "Please keep it under 500 characters.";

  return errors;
}