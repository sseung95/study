import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) 검색 결과에서 선택된 레시피 마크하기
    resultsView.update(model.getSearchResultPage());

    // 1) 북마크 뷰 업데이트
    bookmarksView.update(model.state.bookmarks);

    // 2) 레시피 로딩
    await model.loadRecipe(id);

    // 3) 레시피 렌더링
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    console.log(model.state.search);

    resultsView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) 북마크 추가 or 삭제
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) 레시피 뷰 업데이트
  recipeView.update(model.state.recipe);

  // 3) 북마크목록 렌더링
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
