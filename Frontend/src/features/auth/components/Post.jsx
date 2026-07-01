import profile from "../../../assets/profile.png"

const Post = ({ name, title, content }) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-3">
      <img src={profile}  width={50} height={50} className="rounded-full" />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
      <p className="text-sm">{content}</p>
      <div className="flex gap-4 mt-4 text-gray-500 border-t pt-2">
        <button>Like</button>
        <button>Comment</button>
      </div>
    </div>
  );
};
export default Post;