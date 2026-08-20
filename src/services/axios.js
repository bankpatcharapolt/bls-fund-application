import axios from "axios";

const responseInterceptor = response => {
  if (response.status === 200) {
    return response.data;
  }
  return response;
};

const errorResponseInterceptor = error => {
  return Promise.reject(error);
};

const openAccountFundAPI = axios.create({
  baseURL: process.env.VUE_APP_API_URL
});

openAccountFundAPI.interceptors.response.use(
  responseInterceptor,
  errorResponseInterceptor
);

export { openAccountFundAPI };
