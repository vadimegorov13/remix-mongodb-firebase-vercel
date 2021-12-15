import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useFormAction,
  useLoaderData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import { deletePost, getPostEdit, updatePost } from "~/post";
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

  invariant(typeof id === "string");

  if (formData.get("_method") === "delete") {
    await deletePost(id);
    return redirect("/admin");
  }

  let errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  // console.log(
  //   "calling updatePost with id, title, slug, markdown: ",
  //   id,
  //   title,
  //   slug,
  //   markdown
  // );

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
  let slug = post.slug;

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
    <>
      <Form method="post">
        <p>
          <input
            className="hiddenBlogID"
            name="id"
            defaultValue={post.id}
          ></input>
        </p>
        <p>
          <label htmlFor="">
            Post Title: {errors?.title && <em>Title is required</em>}{" "}
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              onChange={handleChange}
            />
          </label>
        </p>
        <p>
          <label htmlFor="">
            Post Slug: {errors?.slug && <em>Slug is required</em>}
            <input defaultValue={slug} id="slugInput" type="text" name="slug" />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Markdown:</label>{" "}
          {errors?.markdown && <em>Markdown is required</em>}
          <br />
          <textarea
            defaultValue={post.markdown}
            name="markdown"
            id=""
            rows={20}
            cols={50}
          />
        </p>
        <p>
          <button type="submit" className="adminButton updateButton">
            {transition.submission ? "Updating..." : "Update Post"}
          </button>
        </p>
      </Form>
      <Form method="post">
        <p>
          <input
            name="_method"
            type="hidden"
            defaultValue={post.id}
            value="delete"
          ></input>
          <input type="hidden" name="id" defaultValue={post.id}></input>
        </p>
        <p>
          <button className="adminButton deleteButton" type="submit">
            Delete
          </button>
        </p>
      </Form>
    </>
  );
}
