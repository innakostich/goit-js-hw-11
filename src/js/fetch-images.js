import axios from 'axios';

const fetchImages = async (url) => {
  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const { hits, totalHits } = response.data;
      const images = hits.map((hit) => ({
        id: hit.id,
        webformatURL: hit.webformatURL,
        tags: hit.tags,
        likes: hit.likes,
        views: hit.views,
        comments: hit.comments,
        downloads: hit.downloads,
      }));

      return { images, totalHits };
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong. Please try again later.');
  }
};

export { fetchImages };
