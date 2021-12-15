import {
  Outlet,
  Link,
  useLoaderData,
  LoaderFunction,
  json,
  redirect,
} from "remix";
import { getPosts } from "~/post";
import { commitSession, getSession } from "~/session.server";
import adminStyles from "~/styles/admin.css";
import { PostData } from "~/utils/types";

//create a stylesheet ref for the admin.css file
export let links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("access_token")) {
    return redirect("/login");
  }

  const data = { error: session.get("error") };

  return (
    json(data, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }),
    getPosts()
  );
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
