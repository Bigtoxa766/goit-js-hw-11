import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { PixabayAPI } from "./PixabayAPI";

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.hidden = true;

const pixabayAPI = new PixabayAPI();

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onClick)

function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value;
  pixabayAPI.query = searchQuery;

  pixabayAPI.fetchPhoto().then(data => {

    if (data.hits.length === 0) {
      Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    
    formEl.reset();
    galleryEl.innerHTML = '';
    renderCard(data.hits);
    loadMoreBtn.hidden = false;

    if (data.hits.length === 0 || data.hits.length < pixabayAPI.perPage) {
        loadMoreBtn.hidden = true;
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
   
  })
};

function renderCard(arr) {
 return arr.map(({ webformatURL, largeImageURL, tags, likes,
  views, comments, downloads}) => {
    const markup = `
<div class="photo-card">
  <div class="photo-wrapper"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px"/></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;

    galleryEl.insertAdjacentHTML('beforeend', markup)
  }).join()
};

function onClick() {
  
  pixabayAPI.page += 1;
  pixabayAPI.fetchPhoto()
    .then(data => {
      renderCard(data.hits)

      if (data.hits.length === 0 || data.hits.length < pixabayAPI.perPage) {
        loadMoreBtn.hidden = true;
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
    })
};



