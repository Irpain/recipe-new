import React, { useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { onCreateComment } from '../graphql/subscriptions';

function CommentNotification({ recipeId }) {
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateComment, { recipeID: recipeId })
    ).subscribe({
      next: (data) => {
        const newComment = data.value.data.onCreateComment;
        alert(`New comment on your recipe "${newComment.recipeID}": ${newComment.content}`);
        // Alternatively, use a toast notification library
      },
      error: (error) => console.warn(error),
    });

    return () => subscription.unsubscribe();
  }, [recipeId]);

  return null;
}

export default CommentNotification;