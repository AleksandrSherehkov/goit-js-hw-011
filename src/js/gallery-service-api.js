import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

export class GaleryApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28592682-30ff71119c6d581761e4defab';
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = '';
    this.viewedHits = 0;
  }

  async getRequest() {
    const url = this.#BASE_URL;

    const options = {
      params: {
        page: this.page,
        q: this.searchQuery,
        key: this.#API_KEY,
        per_page: '40',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };

    const response = await axios.get(url, options);
    const data = await response.data.hits;
    console.log(data);
    this.checksForSerchResponse(data);

    this.setTotalHits(response.data.totalHits);
    this.addHits(response.data.hits);
    this.addPage();

    return data;
  }

  setTotalHits(newTotalHits) {
    this.totalHits = newTotalHits;
  }

  addPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.viewedHits = 0;
  }

  checksForSerchResponse(data) {
    if (data.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
        width: '300px',
        fontSize: '16px',
      });
    }

    return;
  }

  addHits(data) {
    this.viewedHits += data.length;
  }

  resetTotalHits() {
    this.totalHits = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newSearchQuery) {
    if (newSearchQuery === '') {
      Notify.failure('Sorry, enter a query in the search field.');
    }

    this.searchQuery = newSearchQuery;
  }
}
