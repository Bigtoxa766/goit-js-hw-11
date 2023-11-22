import Notiflix from 'notiflix';
import axios from 'axios';

export class PixabayAPI {
  API_KEY = '34923818-41fb85465916de5dce0352c63';
  BASE_URL = 'https://pixabay.com/api/';
  
  query = null;
  page = 1;
  perPage = 40;

  async fetchPhoto() {

    const params = new URLSearchParams({
      key: this.API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage
    })
    try {
      const resp = await axios(`${this.BASE_URL}?${params}`)
      const dataPic = await resp.data;
      return dataPic
    } catch (err) {
      Notiflix.Notify.failure(err)
    }
}
};