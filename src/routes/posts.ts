import Elysia from "elysia";
import {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsWithComments,
  getPostsByIdWithComments,
} from "../db/queries";
import { InsertPost } from "../db/schema";
import { jwt } from "@elysiajs/jwt";
export default new Elysia()
  .use(
    jwt({
      secret: process.env.JWT_SECRET!,
    })
  )
  .onBeforeHandle(async (context) => {
    const token = context.headers.authorization?.split(" ")[1];
    const user = await context.jwt.verify(token);
    if (!user) {
      context.set.status = 401;
      return "invalid token";
    }
  })

  .get("/posts", async function () {
    const posts = await getPostsWithComments();
    return posts;
  })
  .post("/posts", async function (context) {
    try {
      const body = context.body as InsertPost;
      await createPost(body);
      return "Post created";
    } catch (error) {
      console.log(error);
      return "Failed to create post";
    }
  })

  .get("/posts/:id", async (context) => {
    const postId = Number(context.params.id);
    const post = await getPostsByIdWithComments(postId);
    return post;
  })
  .put("/posts/:id", async (context) => {
    try {
      const postId = Number(context.params.id);
      const body = context.body as InsertPost;
      updatePost(postId, body);
      console.log("Post updated");
    } catch (error) {
      console.log(error);
      return "Failed to update post";
    }
  })
  .delete("/posts/:id", async (context) => {
    try {
      const postId = Number(context.params.id);
      deletePost(postId);
      return "Post deleted";
    } catch (error) {
      console.log(error);
      return "Failed to delete post";
    }
  });
