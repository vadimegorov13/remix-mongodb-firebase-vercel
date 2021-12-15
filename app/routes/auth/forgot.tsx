import { ActionFunction, Form, Link, redirect } from "remix";
import invariant from "tiny-invariant";
import { forgotPassword } from "~/user";
import { ForgotPasswordError } from "~/utils/types";
import authStyles from "~/styles/auth.css";

//create a stylesheet ref for the auth.css file 
export let links = () => {
    return [{rel: "stylesheet", href: authStyles}]
}

export let action: ActionFunction = async ({ request }) => {
  // pull in the form data from the request after the form is submitted
  let formData = await request.formData();
  let email = formData.get("email");

  // Validate data
  const errors: ForgotPasswordError = {};
  if (!email) errors.email = true;

  if (Object.keys(errors).length) {
    return errors;
  }
  invariant(typeof email === "string");

  await forgotPassword({ email });

  // success, send user to /login page
  return redirect("/login");
};

const Login = () => {
  return (
    <div className="loginContainer">
      <div className="authTitle">
        <h1>Forgot Password?</h1>
      </div>
      <Form method="post">
        <p>Enter the email address associated with your account</p>
        <input
          className="loginInput"
          type="email"
          name="email"
          placeholder="you@awesome.dev"
          required
        />
        <button className="loginButton" type="submit">
          Submit
        </button>
      </Form>
      <div className="additionalLinks">
        Not Yet Registered? <Link to="/auth/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
