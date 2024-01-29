import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import {getVerificationTokenByEmail} from "@/data/verificationToken";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);
  if(existingToken) { // if token already exists, delete it
    await db.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    });
  }

  const verificationToken = await db.verificationToken.create({ // create new token
    data: {
      email,
      token,
      expires,
    }
  });

  return verificationToken; 
}