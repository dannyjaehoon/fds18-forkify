import Search from './models/Search';
import Recipe from './models/Recipe';
import Bookmark from './models/Bookmark';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as bookmarkView from './views/bookmarkView';
import createSpinner from './views/spinner';


//clear localstorage
localStorage.clear();

const renderSearchResult = () => {
  // obtain current page;
  const page = Search.getCurrentPage();
  // obtain limited recipes per page
  const recipesPerPage = Search.getRecipesPerPage(page);
  // show recipes
  searchView.showRecipes(recipesPerPage);
  // show pagination
  searchView.showPagination(page, page + 1, recipesPerPage);
};

// search and display recipes on the left side 
const searchHandler = async e => {
  e.preventDefault();
  const searchWord = e.target.children[0].value;
  // search and update the model
  await Search.obtainRecipe(searchWord);

  renderSearchResult();
  // update page when pagination button is clicked
};

const changePage = e => {
  if (!e.target.classList.contains('pagination__btn--prev') && !e.target.classList.contains('pagination__btn--next')) return;
  const pageNum = e.target.classList.contains('pagination__btn--prev') ? -1 : 1;
  Search.updatePage(pageNum);
  renderSearchResult();
};

document.querySelector('.search').addEventListener('submit', searchHandler);
document.querySelector('.pagination').addEventListener('click', changePage);


// show each recipe on the main section
const showDetailedInfoOfRecipe = async e => {
  e.preventDefault();
  createSpinner();
  //obtain the specific recipe
  const btn = e.target.closest('.preview__link');
  if(!btn) return;
  const id = btn.getAttribute('href');
  const recipe = await Recipe.obtainSpecificRecipe(id);
  recipeView.showDetailedRecipeInfo(recipe);
};

document.querySelector('.results').addEventListener('click', showDetailedInfoOfRecipe);

// update serving
const updateServing = e => {
  // update serving 
  // updateServing();
  const increaseBtn = e.target.closest('.btn--increase-servings');
  const decreaseBtn = e.target.closest('.btn--decrease-servings');
  
  if (!increaseBtn && !decreaseBtn) return;
  const updateServings = increaseBtn ? 1 : -1;
  Recipe.updateServing(updateServings);
  const recipe = Recipe.getCurrentRecipe();
  recipeView.showDetailedRecipeInfo(recipe);
}

document.querySelector('.recipe').addEventListener('click', updateServing);


// add bookmark
const controlBookmark = e => {
  const btn = e.target.closest('.btn--round');
  if (!btn) return;
  // obtain current value
  const recipe = Recipe.getCurrentRecipe();
  //obtain booklist(recipelist)
  const recipeList = Bookmark.getCurrentBookList();
  //check whether the recipe is already stored
  if (Bookmark.isRecipeStored(recipe)) {
    Bookmark.removeBookmark();
    recipeView.showDetailedRecipeInfo(recipe);
    bookmarkView.showBookmarkContent(recipeList);
    return;
  };

  // add bookmark
  Bookmark.addBookmark(recipe);

  //render 
  recipeView.showDetailedRecipeInfo(recipe);
  bookmarkView.showBookmarkContent(recipeList);
}


document.querySelector('.recipe').addEventListener('click', controlBookmark);


// redirect to detailed recipe from bookmark
const redirectToDetailedRecipe = e => {
  showDetailedInfoOfRecipe(e);
}
document.querySelector('.bookmarks__list').addEventListener('click', redirectToDetailedRecipe);

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

export const toggleRecipeEditor = () => {
  document.querySelector('.add-recipe-window').classList.toggle('hidden');
  document.querySelector('.overlay').classList.toggle('hidden');
};

document.querySelector('.nav__btn--add-recipe').addEventListener('click', toggleRecipeEditor);
document.querySelector('.btn--close-modal').addEventListener('click', toggleRecipeEditor);

const addRecipeHandler = async e => {
  e.preventDefault();

  const recipe = Recipe.newRecipe();

  if(!Recipe.isValided()) return;
  const newRecipe = await Recipe.sendNewRecipe(recipe);
  if(!newRecipe) return;
  Bookmark.addBookmark(newRecipe);
  Recipe.updateCurrentRecipe(newRecipe);

  recipeView.showDetailedRecipeInfo(newRecipe);

  const recipeList = Bookmark.getCurrentBookList();
  bookmarkView.showBookmarkContent(recipeList);
  e.target.reset();
  toggleRecipeEditor();
}
document.querySelector('form.upload').addEventListener('submit', addRecipeHandler);
