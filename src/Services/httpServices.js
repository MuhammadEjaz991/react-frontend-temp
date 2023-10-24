import axios from "axios";

// axios.interceptors.response.use(
//   (response) => {
//     const expectedError =
//       !response ||
//       !response.data ||
//       !response.data.code ||
//       response.data.code < 200 ||
//       response.data.code >= 300;
//     if (expectedError) {
//       logger.log(response.data);
//       return Promise.reject(response.data);
//     }
//     return response;
//   },
//   (error) => {
//     const expectedError =
//       error.response &&
//       error.response.status >= 400 &&
//       error.response.status < 500;
//     if (!expectedError) {
//       logger.log(error);
//       toast.error("An unexpected error occurred.");
//     }
//     return Promise.reject(error);
//   }
// );

function setJwt(jwt) {
  if (jwt) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
