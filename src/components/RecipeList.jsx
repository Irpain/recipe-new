import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listRecipes } from '../graphql/queries';
import RecipeCard from './RecipeCard.jsx';
import CreateRecipe from './CreateRecipe.jsx';
import SearchBar from './SearchBar.jsx';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm = '') => {
    try {
      let filter = null;
      if (searchTerm) {
        filter = {
          or: [
            { title: { contains: searchTerm } },
            { ingredients: { contains: searchTerm } },
          ],
        };
      }
      const recipeData = await API.graphql(
        graphqlOperation(listRecipes, { filter })
      );
      setRecipes(recipeData.data.listRecipes.items);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const handleSearch = (term) => {
    fetchRecipes(term);
  };

  return (
    <div className="recipe-list-container">
      <CreateRecipe />
      <SearchBar onSearch={handleSearch} />
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;