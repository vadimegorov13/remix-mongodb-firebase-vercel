import { LoaderFunction, redirect } from "remix";
import { destroySession, getSession } from "~/session.server";
import { logout } from "~/user";

// when this page loads we are going to get the session, if we find one then we are going to destroySession to remove the cookie
export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("access_token")) {
    return redirect("/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  logout();

  return redirect("/");
};
