import { refs } from './refs';

export function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('hidden');
  refs.loadMoreBtn.removeAttribute('disabled');
}

export function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('hidden');
  refs.loadMoreBtn.setAttribute('disabled', '');
}
