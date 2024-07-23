import { Elysia } from "elysia";
const port = process.env.port || 3000;
import posts from "./routes/posts";
import comments from "./routes/comments";
import auth from "./routes/auth";

new Elysia()
  .get("/", async function () {
    return "Hello Friends";
  })
  .use(auth)
  .use(posts)
  .use(comments)

  .listen(port, () => {
    console.log(`Server is running at port: ${port}`);
  });
