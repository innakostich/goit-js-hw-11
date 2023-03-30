import './sass/main.scss';

import { fetchImages } from './js/fetch-images';
import { renderGallery } from './js/render-gallery';
import { onScroll, onToTopBtn } from './js/scroll-bar';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const form = document.querySelector('#search-form');
// const galleryContainer = document.querySelector('.gallery-container');
// const loadMoreButton = document.querySelector('.load-more-button');
// const toTopButton = document.querySelector('.to-top');
// const photoCardTemplate = document.querySelector('#photo-card-template');

// const API_KEY = '34787029-9060cf1f0b6b2569d575ff8e0';
// const BASE_URL = 'https://pixabay.com/api/';
// const PER_PAGE = 40;
// let currentPage = 1;

// // Функция для формирования URL запроса
// function buildUrl(query) {
//   const params = new URLSearchParams({
//     key: API_KEY,
//     q: query,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: PER_PAGE,
//     page: currentPage,
//   });

//   return `${BASE_URL}?${params.toString()}`;
// }

// // Функция для очистки контейнера галереи
// function clearGallery() {
//   galleryContainer.innerHTML = '';
// }

// // Функция для загрузки изображений по запросу
// async function loadPhotos(query) {
//   try {
//     const url = buildUrl(query);
//     const { images, totalHits } = await fetchImages(url);
//     const photoCards = renderGallery(images, photoCardTemplate);

//     galleryContainer.append(...photoCards);

//     // Показываем кнопку "Load more" если есть еще изображения
//     if (galleryContainer.children.length < totalHits) {
//       loadMoreButton.style.display = 'block';
//     } else {
//       loadMoreButton.style.display = 'none';
//     }

//     // Сохраняем значение текущей страницы
//     currentPage++;
//   } catch (error) {
//     console.log(error);
//     Notiflix.Notify.failure('Something went wrong. Please try again later.');
//   }
// }

// // Обработчик события для формы поиска
// form.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const query = event.target.elements.searchQuery.value.trim();

//   if (!query) {
//     return;
//   }

//   // Сбрасываем значение текущей страницы
//   currentPage = 1;

//   clearGallery();
//   loadMoreButton.style.display = 'none';

//   await loadPhotos(query);

//   // Если ничего не найдено, показываем уведомление
//   if (galleryContainer.children.length === 0) {
//     Notiflix.Notify.info(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
// });

// // Обработчик события для кнопки "Load more"
//   loadMoreButton.addEventListener('click', async () => {
//   const query = form.elements.searchQuery.value.trim();
//   await loadPhotos(query);
// });

// // Инициализация Notiflix
// Notiflix.Notify.init({
//   width: '280px',
//   fontSize: '16px',
//   timeout: 3000,
//   position: 'right-top',
// });

// // Инициализация SimpleLightbox
// const lightbox = new SimpleLightbox('.gallery-container a', {
//   captions: true,
//   captionsData: 'alt',
// });

// // Обработчики событий для прокрутки страницы и кнопки "To Top"
// onScroll(() => {
//   const query = form.elements.searchQuery.value.trim();
//   loadPhotos(query);
// });
// onToTopBtn(toTopButton);
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

function onSearchForm(e) {
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

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden');
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
}

function alertNoImagesFound() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
}