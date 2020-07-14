import { toast } from 'react-toastify';
import axios from "axios";

// Intercepting the responses with errors
axios.interceptors.response.use(null, error => { // the error function will be executed everytime we have a response with an error
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
  if (!expectedError) { // if we have an unexpected error, do the below
    console.log("logging the error", error);     // logging the error
    toast.error("An unexpected error ocurred."); // displaying an error message to the user
  }
  return Promise.reject(error); // otherwise we have an expected, and we will return a rejected promise
});                              // to pass control to our catch box we need to return a rejected promise.

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};

// 4.. - Client Request
// 5.. - Server Request