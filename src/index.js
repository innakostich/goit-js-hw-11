 import './sass/main.scss';
 import { fetchImages } from './js/fetch-images';
 import { renderGallery } from './js/render-gallery';
 import { onScroll, onToTopBtn } from './js/scroll-bar';

 import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const photoCardTemplate = document.querySelector('#photo-card-template').content;

const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '34787029-9060cf1f0b6b2569d575ff8e0';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;
let currentPage = 1;

// Функция для формирования URL запроса
function buildUrl(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page: currentPage,
  });

  return `${BASE_URL}?${params.toString()}`;
}

// Функция для рендеринга карточки изображения
function renderPhotoCard(photo) {
  const card = photoCardTemplate.cloneNode(true);

  const img = card.querySelector('img');
  img.src = photo.webformatURL;
  img.alt = photo.tags;

  const likes = card.querySelector('.likes');
  likes.textContent = photo.likes;

  const views = card.querySelector('.views');
  views.textContent = photo.views;

  const comments = card.querySelector('.comments');
  comments.textContent = photo.comments;

  const downloads = card.querySelector('.downloads');
  downloads.textContent = photo.downloads;

  return card;
}

// Функция для очистки контейнера галереи
function clearGallery() {
  gallery.innerHTML = '';
}

// Функция для загрузки изображений по запросу
async function loadPhotos(query) {
  try {
    const url = buildUrl(query);
    const response = await axios.get(url);

    const { hits, totalHits } = response.data;
    const photos = hits.map((hit) => renderPhotoCard(hit));

    gallery.append(...photos);

    // Показываем кнопку "Load more" если есть еще изображения
    if (gallery.children.length < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }

    // Сохраняем значение текущей страницы
    currentPage++;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

// Обработчик события для формы поиска
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    return;
  }

  // Сбрасываем значение текущей страницы
  currentPage = 1;

  clearGallery();
  loadMoreBtn.style.display = 'none';

  await loadPhotos(query);

  // Если ничего не найдено, показываем уведомление
  if (gallery.children.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
});


// Обработчик события для кнопки "Load more"
loadMoreBtn.addEventListener('click', async () => {
    const query = form.elements.searchQuery.value.trim();
    await loadPhotos(query);
  });
  
