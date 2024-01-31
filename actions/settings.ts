"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import {db} from "@/lib/db";
import {SettingSchema} from "@/schemas";
import {getUserByEmail, getUserById} from "@/data/user";
import {currentUser} from "@/lib/auth";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();
  if (!user || !user.id) return {error: "Unauthorized!"};

  const dbUser = await getUserById(user.id);
  if (!dbUser) return {error: "Unauthorized!"};

  // avoid updating these fields if user is using OAuth
  if(user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.password = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // if its trying to update email
  if(values.email && values.email !== user.email) {
    // check if email is not already in use
    const existingUser = await getUserByEmail(values.email);
    if(existingUser && existingUser.id !== user.id) return { error: "Email already in use"}

    // generate verification token and send email
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "Verification email sent!"}
  }

  // if it's trying to update password
  if(values.password && values.newPassword && dbUser.password) {
    // verify if old password is correct
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
    if(!passwordsMatch) return {error: "Incorrect password!" }

    // hash new password
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: {id: dbUser.id},
    data: {
      ...values
    }
  });

  return { success: "Settings Updated!"}
};
