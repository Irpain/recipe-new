import React, { useEffect, useState } from 'react';
import { Storage, Auth } from 'aws-amplify';
import CommentSection from './CommentSection.jsx';
import RatingComponent from './RatingComponent.jsx';
import CommentNotification from './CommentNotification.jsx';

function RecipeCard({ recipe }) {
  const { title, description, images, id, owner } = recipe;
  const [imageURL, setImageURL] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    if (images && images.length > 0) {
      fetchImage(images[0]);
    }
    fetchCurrentUser();
  }, [images]);

  const fetchImage = async (key) => {
    try {
      const url = await Storage.get(key);
      setImageURL(url);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user.username);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  return (
    <div className="recipe-card">
      <h3>{title}</h3>
      {imageURL && <img src={imageURL} alt={`${title}`} style={{ width: '200px' }} />}
      <p>{description}</p>
      <CommentSection recipeId={id} />
      <RatingComponent recipeId={id} />
      {currentUser === owner && <CommentNotification recipeId={id} />}
      {/* Add buttons or links for editing, deleting, etc. */}
    </div>
  );
}

export default RecipeCard;