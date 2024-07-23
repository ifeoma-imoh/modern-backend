import Elysia from "elysia";
import { InsertUser } from "../db/schema";
import { createUser, getUserByEmail } from "../db/queries";
import { jwt } from "@elysiajs/jwt";

export default new Elysia()
  .post("/auth/signup", async function (context) {
    try {
      const body = context.body as InsertUser;
      const password = await Bun.password.hash(body.password);
      await createUser({ ...body, password });
      return "User created";
    } catch (error) {
      console.log(error);
      return "Failed to create user";
    }
  })
  .use(
    jwt({
      secret: process.env.JWT_SECRET!,
    })
  )
  .post("/auth/signin", async function (context) {
    try {
      const body = context.body as { email: string; password: string };
      const user = await getUserByEmail(body.email);

      if (!user.length) {
        return "User not found";
      }

      const isPasswordValid = await Bun.password.verify(
        body.password,
        user[0].password
      );

      if (!isPasswordValid) {
        return "Invalid password";
      }
      console.log(user);

      const jwt = await context.jwt.sign({
        email: user[0].email,
        name: user[0].name,
      });
      return jwt;
    } catch (error) {
      console.log(error);
      return "Failed to sign in ";
    }
  });
