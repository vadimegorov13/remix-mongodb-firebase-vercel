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
