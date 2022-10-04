import { parameters } from './params';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class PhotosApiService {
  constructor() {
    this.pageCounter = 1;
  }

  getPictures = async function () {
    const URL = 'https://pixabay.com/api/';
    const body = parameters.toString();
    const SEARCH_URL = `${URL}?&${body}`;
    try {
      if (parameters.get('q').trim() !== '') {
        const response = await axios.get(SEARCH_URL);
        return response.data;
      } else {
        Notify.info('Please enter what images you want to find and try again.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  resetPageCounter() {
    parameters.set('page', '1');
  }

  setQuery(newQuery) {
    parameters.set('q', newQuery);
  }

  increasePageCounter() {
    this.pageCounter += 1;
    parameters.set('page', this.pageCounter);
  }
  getPageCounter() {
    return this.pageCounter;
  }
}
