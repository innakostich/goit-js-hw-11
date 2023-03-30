export { fetchImages };

import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '34787029-9060cf1f0b6b2569d575ff8e0';

async function fetchImages(query, page, perPage) {
  try {
    const url = `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching images.');
  }
}



