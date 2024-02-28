// import axios from 'axios';
// import { ASSET_TOKEN } from './constant';
import axios from 'axios';
import { getCookie } from './helper';

const restApi = axios.create({
  baseURL: process.env.REACT_APP_URL_API // Thay thế bằng URL API thực tế của bạn
});

// Request interceptor for API calls
const assToken = getCookie('ASSET_TOKEN');
restApi.interceptors.request.use(
  async (confi) => {
    confi.headers = {
      Authorization: `Bearer ${assToken}`,
      Accept: 'application/json'
    };
    return confi;
  },
  (error) => {
    Promise.reject(error);
  }
);
// Response interceptor for API calls
restApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    console.log('err', error);
    if (error?.response?.status === 401 && assToken) {
      logout();
    }
    return error.response;
  }
);

export default restApi;
