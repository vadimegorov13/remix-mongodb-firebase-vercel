import { Outlet, Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import adminStyles from "~/styles/admin.css";
import { PostData } from "~/utils/types";

//create a stylesheet ref for the admin.css file
export let links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export let loader = () => {
  return getPosts();
};

const Admin = () => {
  let posts = useLoaderData<PostData[]>();
  return (
    <div className="admin">
      <h1 className="adminTitle">Admin</h1>
      <nav>
        <p>Click on a post to edit the blog post</p>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <main>
          {/* Outlet renders the /admin/index.jsx */}
          <Outlet />
        </main>
      </nav>
    </div>
  );
};

export default Admin;
