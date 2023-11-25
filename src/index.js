import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { PixabayAPI } from "./PixabayAPI";

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const target = document.querySelector('.js-guard');

const pixabayAPI = new PixabayAPI();

let options = {
  root: null,
  rootMargin: "300px",
};

let observer = new IntersectionObserver(onLoad, options);

const simpleLightbox = () => new SimpleLightbox('.photo-wrapper a');
 
function onLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      
      pixabayAPI.page += 1;
  pixabayAPI.fetchPhoto()
    .then(data => {
      renderCard(data.hits);

      simpleLightbox().refresh();

      if (data.hits.length === 0
        || data.hits.length < pixabayAPI.perPage
        || pixabayAPI.page >= data.totalHits / pixabayAPI.perPage) {
        
        observer.unobserve(target);
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
      }
    })
    }
   })
};

formEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  
  let searchQuery = e.target.elements.searchQuery.value.trim();
  pixabayAPI.query = searchQuery;
  pixabayAPI.page = 1;

  pixabayAPI.fetchPhoto().then(data => {

    if (data.hits.length === 0 || pixabayAPI.query === '') {
      formEl.reset();
     return Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    
    formEl.reset();
    galleryEl.innerHTML = '';
    renderCard(data.hits);

    simpleLightbox().refresh();

    if (data.hits.length === 0 || data.hits.length < pixabayAPI.perPage) {
        return Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    }

    observer.observe(target);
    
  })
};

function renderCard(arr) {
 return arr.map(({ webformatURL, largeImageURL, tags, likes,
  views, comments, downloads}) => {
    const markup = `
<div class="photo-card">
  <div class="photo-wrapper"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="350px"/></a></div>
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
