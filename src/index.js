import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { GaleryApiService } from './js/gallery-service-api';
import { refs } from './js/refs';
import galleryMarkup from './templates/gallery-card.hbs';

const galeryApiService = new GaleryApiService();
let gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const handleQueryApi = async () => {
  try {
    if (galeryApiService.query === '') {
      return;
    }
    Loading.circle('Loading...');
    data = await galeryApiService.getRequest();
    appendGalleryMarkup(data);
    Loading.remove();

    gallery.refresh();
    checkResetHits();
  } catch (error) {
    Loading.remove();
    //isBtnHide();
    console.log(error);
  }
};

const onFormSubmit = async e => {
  e.preventDefault();
  galeryApiService.query = e.currentTarget.elements.searchQuery.value;

  // isBtnHide();
  clearGallery();
  galeryApiService.resetPage();
  galeryApiService.resetTotalHits();

  await handleQueryApi();
  notificationToltalHits();
  // if (data.length === 0) {
  //   isBtnHide();
  // } else {
  //   isBtnShow();
  // }
};

const checkResetHits = () => {
  if (galeryApiService.totalHits === 0) {
    return;
  }
  if (galeryApiService.totalHits <= galeryApiService.viewedHits) {
    Notify.warning("We're sorry, but you've reached the end of search results.");
    // isBtnHide();
  }
};

const appendGalleryMarkup = data => {
  refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup(data));
};

const clearGallery = () => {
  refs.galleryContainer.innerHTML = '';
};

// const isBtnHide = () => {
//   refs.loadMoreBtn.classList.add('is-hidden');
// };

// const isBtnShow = () => {
//   refs.loadMoreBtn.classList.remove('is-hidden');
// };

const onLoadMoreImage = async () => {
  await handleQueryApi();
  scrollPage();
};

const scrollPage = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const notificationToltalHits = () => {
  const totalHits = galeryApiService.totalHits;
  if (totalHits > 0) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }
};

const onEntry = async entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      await handleQueryApi();
    }
  });
};

const options = {
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);

refs.form.addEventListener('submit', onFormSubmit);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreImage);
