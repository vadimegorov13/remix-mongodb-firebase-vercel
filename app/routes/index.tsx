import { useLoaderData, json, Link, redirect, LoaderFunction } from "remix";
import { auth } from "~/utils/firebase";
import { getSession } from "~/session.server";
import { destroySession, commitSession } from "~/session.server";

// use loader to check for existing session
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    //user is logged in
    const data = { user: auth.currentUser, error: session.get("error") };
    return json(data, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  // user is not logged in
  return null;
};

export default function Index() {
  const data = useLoaderData();
  let loggedIn = data?.user;
  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Remix Blog Auth Tutorial!</h2>
        {loggedIn ? <h3>{data.user.email}</h3> : null}

        <h3>
          This blog was created by <strong>Chris Benjamin</strong>
        </h3>
        <p>
          This tutorial will show you how firebase authentication functionality
          works in Remix
        </p>
      </main>
      <aside>
        <h3>Hello</h3>
      </aside>
    </div>
  );
}
