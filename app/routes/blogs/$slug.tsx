import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";
import postStyles from "~/styles/posts.css";

export let links = () => {
  return [{ rel: "stylesheet", href: postStyles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

const PostSlug = () => {
  let post = useLoaderData();
  return (
    <div
      className="postDisplay"
      dangerouslySetInnerHTML={{ __html: post.html }}
    />
  );
};

export default PostSlug;
