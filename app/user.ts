import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ForgotPassword, LoginInput } from "~/utils/types";
import { auth } from "~/utils/firebase";

export const login = async ({ email, password }: LoginInput) => {
  let user: any = null;
  let error: any = null;

  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      error = { errorCode, errorMessage };
    });

  return { user, error };
};

export const register = async ({ email, password }: LoginInput) => {
  let user: any = null;
  let error: any = null;

  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      error = { errorCode, errorMessage };
    });

  return { user, error };
};

export const logout = async () => {
  await signOut(auth);
};

export const forgotPassword = async ({ email }: ForgotPassword) => {
  // perform firebase send password reset email
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err: any) {
    console.log("Error: ", err.message);
  }
};
