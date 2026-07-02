
import { useContext, useEffect, useState } from 'react';
import { ThumbsUp, MessageSquare, MoreHorizontal } from 'lucide-react';
import profile from "../../../assets/profile.png";
import moment from "moment"
import { authDataContext } from '../../../context/AuthContext';
import { userDataContext } from '../../../context/UserContext';
import axios from 'axios';
import { io } from 'socket.io-client';

let socket =io("http://localhost:3000")

const Post = ({ id , author, image, description, likes, comments , createdAt }) => {
  const authorName = author ? `${author.firstName || ""} ${author.lastName || ""}`.trim() : "User";
  const authorTitle = author?.headline || "Member";
  const authorImage = author?.profilePic || profile;
  const [isExpanded, setIsExpanded] = useState(false);
  const [postss, setPostss] = useState(Array.isArray(likes) ? likes : []);
  const [isLiked, setIsLiked] = useState(false);
  const [postComments, setPostComments] = useState(Array.isArray(comments) ? comments : []);
  const [commentText, setCommentText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const shouldShowToggle = (description || "").length > 180;
  const displayDescription = isExpanded || !shouldShowToggle ? (description || "") : `${(description || "").slice(0, 180)}...`;
  const likeCount = postss.length;
  const commentCount = postComments.length;

  let {serverUrl} = useContext(authDataContext)
  let {userData, getPosts} = useContext(userDataContext)

  useEffect(() => {
    socket.on("likeUpdated" , (postId , likes) =>{
      if(postId === id){
        setPostss(likes)
      }
    })

    socket.on("commentAdded" , ({postId , comments}) =>{
      if(postId === id){
        setPostComments(comments)
      }}
    )

   
    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }

  }, [id]);


  useEffect(() => {
    setPostss(Array.isArray(likes) ? likes : []);
    // Normalize comments: if backend returned only user id for a comment,
    // replace it with current userData when it matches so profilePic shows immediately.
    const normalized = (Array.isArray(comments) ? comments : []).map((c) => {
      const userField = c?.user;
      if (!userField) return c;
      // if user is a string id and matches current user, replace with userData
      if (typeof userField === 'string' && userData && userField === userData._id) {
        return { ...c, user: userData };
      }
      return c;
    });
    setPostComments(normalized);
    setIsLiked(Array.isArray(likes) ? likes.some((like) => like === userData?._id || like?._id === userData?._id) : false);
  }, [likes, comments, userData?._id]);

  const handleLike = async()=>{
    try{
      let result = await axios.get(serverUrl + "/api/post/like/" + id , {
        withCredentials:true
      })

      if(result?.data?.likes){
        setPostss(result.data.likes)
        setIsLiked(result.data.likes.some((like) => like === userData?._id || like?._id === userData?._id))
      }else{
        setPostss(prev => isLiked ? prev.filter((like) => like !== userData?._id) : [...prev, userData?._id])
        setIsLiked(prev => !prev)
      }

      getPosts()
    }catch(error){
      console.log(error)
    }
  }

  const handleComment = async (e)=>{
    e.preventDefault();

    if(!commentText.trim()) return;

    try{
      let result = await axios.post(serverUrl + "/api/post/comment/" + id, {
        comment: commentText.trim()
      }, {
        withCredentials:true
      })

      if(result?.data?.post?.comments){
        const mapped = result.data.post.comments.map((c) => {
          const userField = c?.user;
          if (!userField) return c;
          if (typeof userField === 'string' && userData && userField === userData._id) {
            return { ...c, user: userData };
          }
          return c;
        });
        setPostComments(mapped)
      }

      setCommentText("")
      setShowAllComments(true)
      getPosts()
    }catch(error){
      console.log(error)
    }
  }

  return (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 max-w-[680px] w-full mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <img src={authorImage} alt={authorName} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
          <div>
            <h4 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer">{authorName}</h4>
            <p className="text-xs text-gray-500 font-medium">{authorTitle}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              {moment(createdAt).fromNow()}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <div className={`text-sm text-gray-800 leading-relaxed whitespace-pre-wrap ${!image && !isExpanded && shouldShowToggle ? 'max-h-16 overflow-hidden' : ''}`}>
          <p>{displayDescription}</p>
        </div>
        {shouldShowToggle && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-sm font-semibold text-blue-600 mt-2 hover:underline"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
        {image && <img src={image} alt="Post" className="w-full rounded-lg mt-4 object-cover" />}

        <div className="mt-3 border-t border-gray-100 pt-3">
          {postComments.length > 0 && (
            <div className="space-y-2 mb-3">
              {(showAllComments ? postComments : postComments.slice(-2)).map((commentItem, index) => {
                const commentUser = commentItem?.user;
                const commentUserName = commentUser ? `${commentUser.firstName || ""} ${commentUser.lastName || ""}`.trim() : "User";

                return (
                  <div key={index} className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-start gap-2">
                      <img src={commentUser?.profilePic || profile} alt={commentUserName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{commentUserName}</p>
                        <p className="text-sm text-gray-700">{commentItem?.comment}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {postComments.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllComments((prev) => !prev)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  {showAllComments ? 'Hide comments' : `Show all ${postComments.length} comments`}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleComment} className="flex items-center gap-2">
            <img src={userData?.profilePic || profile} alt="Me" className="w-8 h-8 rounded-full object-cover" />
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-full"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <div className="bg-blue-500 w-4 h-4 rounded-full flex items-center justify-center">
              <ThumbsUp size={10} className="text-white" />
            </div>
            {likeCount} likes
          </span>
          <span className="text-xs text-gray-500 hover:underline cursor-pointer">{commentCount} comments</span>
        </div>

        <div className="flex gap-1 border-t border-gray-100 pt-2">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-md font-semibold transition ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <ThumbsUp size={20} className={isLiked ? 'text-blue-600' : 'text-gray-600'} />
            {isLiked ? 'Liked' : 'Like'}
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-md text-gray-600 font-semibold transition">
            <MessageSquare size={20} /> Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;