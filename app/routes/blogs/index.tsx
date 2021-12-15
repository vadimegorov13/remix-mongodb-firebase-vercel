import { getPosts } from "~/post";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { PostData } from "~/utils/types";
import postStyles from "~/styles/posts.css";

export let links = () => {
  return [{ rel: "stylesheet", href: postStyles }];
};

export let loader: LoaderFunction = async () => {
  return getPosts();
};

const Posts = () => {
  let posts = useLoaderData<PostData[]>();
  return (
    <div>
      <h1>My Remix Blog</h1>
      <p>Click on the post name to read the post</p>

      <div>
        <Link to="/admin">Blog Admin (Edit/Create)</Link>
      </div>

      <ul>
        {posts.map((post) => (
          <li className="postList" key={post.slug}>
            <Link className="postTitle" to={post.slug}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
