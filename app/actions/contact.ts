"use server";

export type ContactState = {
  ok: boolean;
  message: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in name, email, and message." };
  }

  // Placeholder until Prisma + mailer: accept and acknowledge
  return {
    ok: true,
    message: "Thanks — we received your message and will respond shortly.",
  };
}
