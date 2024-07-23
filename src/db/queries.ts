import { db } from ".";
import { eq, count, getTableColumns } from "drizzle-orm";
import { type InsertUser, type SelectUser, usersTable } from "./schema";
import {
  type InsertPost,
  type SelectPost,
  postsTable,
  commentsTable,
  InsertComment,
  SelectComment,
} from "./schema";

export async function createUser(user: InsertUser) {
  await db.insert(usersTable).values(user);
}

export async function getUserByEmail(email: SelectUser["email"]) {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
}

export async function updateUser(
  id: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>
) {
  await db.update(usersTable).set(data).where(eq(usersTable.id, id));
}

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

// Get Posts
export async function getPosts() {
  return db.select().from(postsTable);
}

// Get Posts with comments
export async function getPostsWithComments() {
  return db
    .select({
      ...getTableColumns(postsTable),
      commentCount: count(commentsTable.id),
    })
    .from(postsTable)
    .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
    .groupBy(postsTable.id);
}

// Create Post
export async function createPost(post: InsertPost) {
  await db.insert(postsTable).values(post);
}

export async function createPostt(post: InsertPost) {
  await db.insert(postsTable).values(post);
}
// Select data
export async function getPostById(id: SelectPost["id"]) {
  return await db.select().from(postsTable).where(eq(postsTable.id, id));
}

// Get post with comments
export async function getPostsByIdWithComments(id: SelectPost["id"]) {
  const rows = await db
    .select()
    .from(postsTable)
    .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
    .where(eq(postsTable.id, id));

  type PostWithComments = SelectPost & {
    comments: SelectComment[];
  };

  type Result = {
    [key: string]: PostWithComments;
  };

  const result: Result = {};

  rows.forEach(({ posts_table, comments_table }) => {
    if (!result[posts_table.id]) {
      result[posts_table.id] = { ...posts_table, comments: [] };
    }
    result[posts_table.id].comments.push(comments_table as SelectComment);
  });
  const transformedData = Object.values(result);
  console.log(transformedData);
  return transformedData;
}

export async function updatePost(
  id: SelectPost["id"],
  data: Partial<Omit<SelectPost, "id">>
) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}

// Delete data
export async function deletePost(id: SelectPost["id"]) {
  await db.delete(postsTable).where(eq(postsTable.id, id));
}

// Create comment
export async function createComment(comment: InsertComment) {
  await db.insert(commentsTable).values(comment);
}
