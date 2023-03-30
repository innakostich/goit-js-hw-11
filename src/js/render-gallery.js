const renderGallery = (images, photoCardTemplate) => {
    return images.map((image) => {
      const card = photoCardTemplate.cloneNode(true);
      const img = card.querySelector('.gallery__image');
      img.src = image.webformatURL;
      img.alt = image.tags;
      const likes = card.querySelector('.gallery__likes');
      likes.textContent = image.likes;
      const views = card.querySelector('.gallery__views');
      views.textContent = image.views;
      const comments = card.querySelector('.gallery__comments');
      comments.textContent = image.comments;
      const downloads = card.querySelector('.gallery__downloads');
      downloads.textContent = image.downloads;
  
      return card;
    });
  };
  
  export { renderGallery };
  