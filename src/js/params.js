import { API_KEY } from './key';

export const parameters = new URLSearchParams({
  key: API_KEY,
  page: '1',
  per_page: '40',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  q: '',
});
