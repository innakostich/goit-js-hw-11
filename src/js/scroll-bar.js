const onScroll = (callback, container) => {
    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        callback(container);
      }
    });
  };
  
  const onToTopBtn = (toTopBtn) => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        toTopBtn.classList.add('show');
      } else {
        toTopBtn.classList.remove('show');
      }
    });
  
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };
  
  export { onScroll, onToTopBtn };
  