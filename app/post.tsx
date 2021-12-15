import { PrismaClient } from "@prisma/client";
import { marked } from "marked";
import { NewPost, PostData } from "./utils/types";

// let's create a reference to prisma
const prisma = new PrismaClient();

// async function since we will be loading external data
export const getPosts = async () => {
  // await prisma connection
  await prisma.$connect();
  // let's grab all posts using findMany()
  // the posts in prisma.posts is the collection we created in Mongo.db
  const allPosts = await prisma.posts.findMany();
  // let's cleanup our connection
  prisma.$disconnect();
  // let's see what we are returning
  // console.log(allPosts);
  return allPosts;
};

// this function is used to load a single post from a passed through slug
export const getPost = async (slug: string) => {
  //setup our prisma connection
  await prisma.$connect();

  // we will find the first database entry that matches the passed slug
  const foundSlug = await prisma.posts.findFirst({
    where: {
      slug,
    },
  });

  let title = "";
  let html = marked("");

  if (foundSlug) {
    //let's extract the title
    title = foundSlug.title;
    // using marked, we are going to convert the markdown into HTML so the blog post can render as entered in Markdown.
    html = marked(foundSlug.markdown);
  }

  // we need to cleanup our database connection
  prisma.$disconnect();

  // let's send back the slug, the title, and our markdown converted to html
  return { slug, title, html };
};

export const createPost = async (post: NewPost) => {
  //Prisma connection
  await prisma.$connect();
  // prisma create
  await prisma.posts.create({
    data: {
      title: post.title,
      slug: post.slug,
      markdown: post.markdown,
    },
  });
  // cleanup prisma connection
  prisma.$disconnect();
  // let's send back the slug we created
  return getPost(post.slug);
};

//when we edit the post we want to return different data including the ID field
export const getPostEdit = async (slug: string) => {
  //setup our prisma connection
  await prisma.$connect();

  // we will find the first database entry that matches the passed slug
  const foundSlug = await prisma.posts.findFirst({
    where: {
      slug,
    },
  });

  let id = "";
  let title = "";
  let markdown = "";

  if (foundSlug) {
    id = foundSlug.id;
    //let's extract the title
    title = foundSlug.title;
    // since we are editing and not rendering we want to pull the original markdown value stored in the db
    markdown = foundSlug.markdown;
  }

  // we need to cleanup our database connection
  prisma.$disconnect();

  // let's send back the slug, the title, and our markdown
  return { id, slug, title, markdown };
};

// When updating we need to reference the ID being updated
export const updatePost = async (post: PostData) => {
  //Prisma connection
  await prisma.$connect();
  // prisma create
  console.log("updatePost id", post.id);
  await prisma.posts.update({
    where: {
      id: post.id,
    },
    data: {
      title: post.title,
      slug: post.slug,
      markdown: post.markdown,
    },
  });

  // cleanup prisma connection
  prisma.$disconnect();
  // let's send back the slug we created
  return getPost(post.slug);
};
