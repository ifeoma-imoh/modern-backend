import Elysia from "elysia";
import { InsertComment } from "../db/schema";
import { createComment } from "../db/queries";

export default new Elysia().post("/comments", async (context) => {
  try {
    const body = context.body as InsertComment;
    const post = await createComment(body);
    console.log("comment created");
    return "Comment created";
  } catch (error) {
    console.log(error);
    return "Failed to create Comment";
  }
});
