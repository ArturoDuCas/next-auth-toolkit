"use server";
import * as z from "zod";
import {signIn} from "@/auth";
import {LoginSchema} from "@/schemas";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";

import {db} from "@/lib/db";
import {
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens";
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail
} from "@/lib/mail";
import {getUserByEmail} from "@/data/user";
import {getTwoFactorTokenByEmail} from "@/data/twoFactorToken";
import {getTwoFactorConfirmationByUserId} from "@/data/twoFactorConfirmation";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return {error: "Invalid fields!"}
  }

  const {email, password, code} = validateFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {error: "Email doesn't exist!"}
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {success: "Email verification sent"}
  }

  // Two-factor authentication
  if(existingUser.isTwoFactorEnabled && existingUser.email) {
    if(code) { // if the user has entered a code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      // if there is no token for the user
      if(!twoFactorToken) return { error: "Invalid code"};
      // if the token doesn't match the code
      if(twoFactorToken.token !== code) return { error: "Invalid code"};
      // if the token has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if(hasExpired) return {error: "Code expired"};


      await db.twoFactorToken.delete({
        where: {id: twoFactorToken.id}
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {id: existingConfirmation.id}
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      })
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try { // try to log in
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return {error: "Invalid credentials!"}
        default:
          return {error: "Something went wrong!"}
      }
    }

    throw err;
  }
};