import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage, Auth } from 'aws-amplify';
import { createRecipe } from '../graphql/mutations';

function CreateRecipe() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState('');

  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser.username);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await Storage.put(file.name, file, {
        contentType: file.type,
      });
      setImage(result.key);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredientsArray = ingredients.split(',').map((ing) => ing.trim());
    const newRecipe = {
      title,
      ingredients: ingredientsArray,
      instructions,
      images: image ? [image] : [],
      owner: user, // Ensure your schema includes an 'owner' field
    };
    try {
      await API.graphql(graphqlOperation(createRecipe, { input: newRecipe }));
      // Reset form
      setTitle('');
      setIngredients('');
      setInstructions('');
      setImage(null);
      alert('Recipe created successfully!');
    } catch (err) {
      console.error('Error creating recipe:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-recipe-form">
      <h2>Create a New Recipe</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Ingredients (separated by commas)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <textarea
        placeholder="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        required
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button type="submit">Create Recipe</button>
    </form>
  );
}

export default CreateRecipe;