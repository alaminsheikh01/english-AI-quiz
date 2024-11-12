"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import db from "../../../db";

export async function verifyUser() {
  try {
    const { getUser } = getKindeServerSession();

    const user = await getUser();

    if (!user) {
      return { success: false };
    }
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.given_name + " " + user.family_name,
        },
      });
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
