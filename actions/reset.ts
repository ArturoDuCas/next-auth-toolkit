"use server";

import * as z from "zod";

import {ResetSchema} from "@/schemas";
import {getUserByEmail} from "@/data/user";
import {sendPasswordResetEmail} from "@/lib/mail";
import {generatePasswordResetToken} from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return {error: "Invalid email!"};

  const {email} = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser) return {error: "Email not found!"};

  const token = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(token.email, token.token);

  return {success: "Reset email sent!"};
}

