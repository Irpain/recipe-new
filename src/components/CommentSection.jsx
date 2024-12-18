import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listComments } from '../graphql/queries';
import { createComment } from '../graphql/mutations';

function CommentSection({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const commentData = await API.graphql(
        graphqlOperation(listComments, { filter: { recipeID: { eq: recipeId } } })
      );
      setComments(commentData.data.listComments.items);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser.username);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newComment = {
      content,
      recipeID: recipeId,
      user,
    };

    try {
      await API.graphql(graphqlOperation(createComment, { input: newComment }));
      setContent('');
      fetchComments();
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post Comment</button>
      </form>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user}:</strong> {comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;