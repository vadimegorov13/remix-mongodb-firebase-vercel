import { ActionFunction, Form, Link, redirect, useActionData } from "remix";
import invariant from "tiny-invariant";
import { commitSession, getSession } from "~/session.server";
import { register } from "~/user";
import { auth } from "~/utils/firebase";
import { RegisterError } from "~/utils/types";
import authStyles from "~/styles/auth.css";

//create a stylesheet ref for the auth.css file
export let links = () => {
  return [{ rel: "stylesheet", href: authStyles }];
};

// This will be the same as our Sign In but it will say Register and use createUser instead of signIn

export let action: ActionFunction = async ({ request }) => {
  // Get data from the form
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");
  let confirm_password = formData.get("confirm_password");

  // Validate data
  const errors: RegisterError = {};
  if (!email) errors.email = true;
  if (!password) errors.password = true;
  if (!confirm_password) errors.confirm_password = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof email === "string");
  invariant(typeof password === "string");

  //perform a signout to clear any active sessions
  await auth.signOut();

  const { user, error } = await register({ email, password });

  if (!error) {
    let session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", await user.getIdToken());

    return redirect("/blogs", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  // perform firebase register
  return { user, error };
};

const Register = () => {
  const actionData = useActionData();
  return (
    <div className="loginContainer">
      <div className="authTitle">
        <h1>Register</h1>
      </div>
      <Form method="post">
        <label htmlFor="email">Email</label>
        <input
          className="loginInput"
          type="email"
          name="email"
          placeholder="you@awesome.dev"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="loginInput"
          type="password"
          name="password"
          required
        />
        <label htmlFor="password">Confirm Password</label>
        <input
          className="loginInput"
          type="password"
          name="confirm_password"
          required
        />
        <button className="loginButton" type="submit">
          Register
        </button>
      </Form>
      <div className="additionalLinks">
        Already Registered? <Link to="/login">Login</Link>
      </div>
      <div className="errors">
        {actionData?.error ? actionData?.error?.message : null}
      </div>
    </div>
  );
};

export default Register;
