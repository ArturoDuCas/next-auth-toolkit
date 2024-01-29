import {db} from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    return await db.passwordResetToken.findUnique({
      where: {token}
    });
  } catch (err) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    return await db.passwordResetToken.findFirst({
      where: {email}
    });
  } catch (err) {
    return null;
  }
};