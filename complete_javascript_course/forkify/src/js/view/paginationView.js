import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1페이지이고 다음페이지 있을 때
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNext(curPage);
    }

    // 마지막 페이지일 때
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPrev(curPage);
    }

    // 1페이지 이상이고 마지막페이지 아닐 때
    if (curPage < numPages) {
      return `${this._generateMarkupPrev(curPage)}${this._generateMarkupNext(
        curPage
      )}`;
    }

    // 1페이지이고 다음페이지 없을 때
    if (curPage === 1 && numPages === 1) {
      return;
    }
  }

  _generateMarkupNext(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }

  _generateMarkupPrev(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
  }
}

export default new PaginationView();
