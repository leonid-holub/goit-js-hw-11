import PhotosApiService from './photos-service';
import { refs } from './refs';
import { showLoadMoreBtn, hideLoadMoreBtn } from './load-more-btn';
import { smoothScroll } from './smooth-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

let totalHits;
const photosApiService = new PhotosApiService();
refs.searchBtn.addEventListener('click', event => {
  event.preventDefault();
  searchPictures();
});

const searchPictures = async function () {
  photosApiService.setQuery(refs.searchField.value);
  refs.galleryWrapper.innerHTML = '';
  photosApiService.resetPageCounter();
  await showPictures();
  if (totalHits !== undefined) {
    Notify.success(`Hooray! We found ${totalHits} images fo you!`);
  }
};

const findPictures = async function () {
  const picturesInfo = await photosApiService.getPictures();
  if (picturesInfo.hits.length > 0) {
    totalHits = picturesInfo.totalHits;
    picturesInfo.hits.forEach((elem, index) => {
      refs.galleryWrapper.insertAdjacentHTML(
        'beforeend',
        `<a href="${elem.largeImageURL}">
        <div class="photo-card">
      <div class="img-item">
      <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy"/>
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b><br>
          ${elem.likes}</br>
        </p>
        <p class="info-item">
          <b>Views</b><br>
          ${elem.views}</br>
        </p>
        <p class="info-item">
          <b>Comments</b><br>
          ${elem.comments}</br>
        </p>
        <p class="info-item">
          <b>Downloads</b><br>
          ${elem.downloads}</br>
        </p>
      </div>
      </div>
      </a>`
      );
    });
    let gallery = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    gallery.refresh();
  } else if (picturesInfo.hits.length < 1) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const showPictures = async function () {
  hideLoadMoreBtn();
  await findPictures();
  if (
    refs.galleryWrapper.innerHTML !== '' &&
    photosApiService.getPageCounter() * 40 < totalHits &&
    !refs.scrollModeCheckbox.checked
  ) {
    showLoadMoreBtn();
  }
};

const showMorePictures = async function () {
  if (photosApiService.getPageCounter() * 40 < totalHits) {
    await findPictures();
    if (photosApiService.getPageCounter() * 40 > totalHits) {
      hideLoadMoreBtn();
    }
    if (!refs.scrollModeCheckbox.checked) {
      smoothScroll();
    }
  } else {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
};

refs.loadMoreBtn.addEventListener('click', () => {
  photosApiService.increasePageCounter();
  showMorePictures();
});

window.addEventListener('scroll', debounce(showMorePicturesByScroll, 500));

function showMorePicturesByScroll() {
  if (refs.scrollModeCheckbox.checked) {
    hideLoadMoreBtn();
    scrollAddPhotos();
  }
}

function scrollAddPhotos() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 50) {
    photosApiService.increasePageCounter();
    showMorePictures();
  }
}
