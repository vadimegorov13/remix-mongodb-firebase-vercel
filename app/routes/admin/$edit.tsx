import invariant from "tiny-invariant";
import { getPostEdit } from "~/post";
import {
  redirect,
  Form,
  useActionData,
  useTransition,
  useLoaderData,
  ActionFunction,
  LoaderFunction,
} from "remix";
import { updatePost } from "~/post";
import { PostData, PostError } from "~/utils/types";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.edit, "expected params.edit");
  return getPostEdit(params.edit);
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let title = formData.get("title");
  let slug = formData.get("slug");
  let markdown = formData.get("markdown");
  let id = formData.get("id");

  let errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  console.log(
    "calling updatePost with id, title, slug, markdown: ",
    id,
    title,
    slug,
    markdown
  );

  invariant(typeof id === "string");
  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await updatePost({ id, title, slug, markdown });

  return redirect("/admin");
};

export default function PostSlug() {
  let errors = useActionData();
  let transition = useTransition();
  let post = useLoaderData<PostData>();

  // we are going to create the slug for the user
  let slug = "";

  // as the Title input is updated we will generate the slug automatically.
  // My First Post slug would equal 'my-first-post'. We will convert to lower case and we will strip spaces and replace with hyphens
  const handleChange = (e: any) => {
    let text = e.target.value;
    // using regex and replace, let's convert spaces to dashes
    slug = text.replace(/\s/g, "-");

    // lets set the value of the slug text box to be our new slug in lowercase
    (document.getElementById("slugInput") as HTMLInputElement).value =
      slug.toLowerCase();
  };

  return (
    <Form method="post">
      <p>
        <input className="hiddenBlogID" name="id" value={post.id}></input>
      </p>
      <p>
        <label htmlFor="">
          Post Title: {errors?.title && <em>Title is required</em>}
          <input
            onChange={handleChange}
            type="text"
            name="title"
            defaultValue={post.title}
          />
        </label>
      </p>
      <p>
        <label htmlFor="">
          Post Slug: {errors?.slug && <em>Slug is required</em>}
          <input
            defaultValue={post.slug}
            id="slugInput"
            type="text"
            name="slug"
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea
          defaultValue={post.markdown}
          name="markdown"
          id=""
          rows={20}
          cols={30}
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? "Updating..." : "Update Post"}
        </button>
      </p>
    </Form>
  );
}
