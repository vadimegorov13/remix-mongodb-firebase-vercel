// Types for Posts
export type PostData = {
  id: string;
  markdown: string;
  slug: string;
  title: string;
};

export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

// Types for Auth
export type LoginInput = {
  email: string;
  password: string;
};

export type LoginError = {
  email?: boolean;
  password?: boolean;
};

export type RegisterError = {
  email?: boolean;
  password?: boolean;
  confirm_password?: boolean;
};

export type ForgotPassword = {
  email: string;
};

export type ForgotPasswordError = {
  email?: boolean;
};
