import './sass/main.scss';

import { fetchImages } from './js/fetch-images';
import { renderGallery } from './js/render-gallery';
import { onScroll, onToTopBtn } from './js/scroll-bar';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

onScroll();
onToTopBtn();

async function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    alertNoEmptySearch();
    return;
  }

  try {
    const { data } = await fetchImages(query, page, perPage);

    if (data.totalHits === 0) {
      displayNoResultsAlert();
    } else {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      alertImagesFound(data);

      if (data.totalHits > perPage) {
        loadMoreBtn.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    searchForm.reset();
  }
}

async function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const { data } = await fetchImages(query, page, perPage);

    renderGallery(data.hits);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (page >= totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      await delay(500);
      alertEndOfSearch();
    }
  } catch (error) {
    console.log(error);
  }
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search bar cannot be empty. Please type any criteria in the search bar.');
}

function displayNoResultsAlert() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
