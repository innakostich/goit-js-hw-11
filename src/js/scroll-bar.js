export { onScroll, onToTopBtn };

// const toTopBtn = document.querySelector('.btn-to-top');

// window.addEventListener('scroll', onScroll);
// toTopBtn.addEventListener('click', onToTopBtn);

// function onScroll() {
//   const scrolled = window.pageYOffset;
//   const coords = document.documentElement.clientHeight;

//   if (scrolled > coords) {
//     toTopBtn.classList.add('btn-to-top--visible');
//   }
//   if (scrolled < coords) {
//     toTopBtn.classList.remove('btn-to-top--visible');
//   }
// }

// function onToTopBtn() {
//   if (window.pageYOffset > 0) {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
// }
  
  
function debounce(callback, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(null, args);
    }, delay);
  };
}


function onScroll() {
  const scrolled = window.pageYOffset;
  const comply = document.documentElement.clientHeight;
  const isScrolled = scrolled > comply;

  toTopBtn.classList.toggle('btn-to-top--visible', isScrolled);
}


function onToTopBtn() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const toTopBtn = document.querySelector('.btn-to-top');
window.addEventListener('scroll', debounce(onScroll, 10));
toTopBtn.addEventListener('click', onToTopBtn);
