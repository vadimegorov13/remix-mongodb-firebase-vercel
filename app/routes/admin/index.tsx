import { Link } from "remix";

const AdminIndex = () => {
  return (
    <div className="adminNewPostLink">
      <Link to="new">
        <button className="adminNewPostButton">Create a New Post</button>
      </Link>
    </div>
  );
};

export default AdminIndex;
