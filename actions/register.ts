"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";

import {RegisterSchema} from "@/schemas";
import {getUserByEmail} from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) { // If the validation fails, return an error
    return {error: "Invalid fields!"}
  }

  const {email, password, name} = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);



  const existingUser = await getUserByEmail(email);

  if (existingUser) { // If the user already exists, return an error
    return {error: "Email already in use!"}
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token via email


  return {success: "User created!"}
};