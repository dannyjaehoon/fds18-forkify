import Search from './models/Search';
import Recipe from './models/Recipe';
import Bookmark from './models/Bookmark'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import icons from 'url:../img/icons.svg';
import {key} from './config';
import * as bookmarkView from './views/bookmarkView';

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
  await Search.obtainRecipes(searchWord);

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
const controlBookmark = () => {
  // obtain current value
  const recipe = Recipe.getCurrentRecipe();
  //obtain booklist(recipelist)
  const recipeList = Bookmark.getCurrentBookList();
  //check whether the recipe is already stored
  if (Bookmark.isRecipeStored(recipe)) {
    Bookmark.removeBookmark();
    bookmarkView.showBookmarkContent(recipeList);
    return;
  };

  // add bookmark
  Bookmark.addBookmark(recipe);

  //render 
  bookmarkView.showBookmarkContent(recipeList);
}


document.querySelector('.recipe').addEventListener('click', controlBookmark);


// redirect to detailed recipe from bookmark
const redirectToDetailedRecipe = async e => {
  e.preventDefault();
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

const displayRecipeEditor = () => {
  document.querySelector('.add-recipe-window').classList.remove('hidden');
  document.querySelector('.overlay').classList.remove('hidden');
};

const hideRecipeEditor = () => {
  document.querySelector('.add-recipe-window').classList.add('hidden');
  document.querySelector('.overlay').classList.add('hidden');
};

document.querySelector('.nav__btn--add-recipe').addEventListener('click', displayRecipeEditor);
document.querySelector('.btn--close-modal').addEventListener('click', hideRecipeEditor);

document.querySelector('form.upload').addEventListener('submit', e => {
  e.preventDefault();

  const recipe = Recipe.newRecipe();
  console.log(recipe);

  // uploadNewRecipe makes an error
  Recipe.uploadNewRecipe(recipe);

  // should redner this from API server. but uploading is not working
  recipeView.showDetailedRecipeInfo(recipe);

  Recipe.addBookmark(recipe);

  e.target.reset();
  hideRecipeEditor();
});