import axios from 'axios';
// export const baseURL = "https://techie01.pythonanywhere.com/auth"

// export const baseURL = "https://gl8tx74f-8000.inc1.devtunnels.ms/auth"

export const baseURL = "https://9gqxjbjg-8000.inc1.devtunnels.ms/auth"//tahur

// export const baseURL = "https://gl8tx74f-8000.inc1.devtunnels.ms/auth"//mam





const api = axios.create({
  baseURL: baseURL,
});


// //-------------------------- Request interceptorr ------------------------
// api.interceptors.request.use(
//   (config) => {
//     const access = localStorage.getItem('access');
//     if (access) {
//       config.headers.Authorization = `Bearer ${access}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// //------------------------ Response interceptorr -----------------------
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
  
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
  
//         try {
//           const refresh = localStorage.getItem('refresh');
//           const response = await axios.post(baseURL+'/endpoint/', { refresh });
//           const { access } = response.data;
  
//           localStorage.setItem('access', access);
  
//           originalRequest.headers.Authorization = `Bearer ${access}`;
//           return axios(originalRequest);
//         } catch (error) {

//           //------------------------ redirectin To login page iff reffresh token expired ---------------------

//           console.log(error)
//           localStorage.removeItem("refresh")
//           localStorage.removeItem("access")
//           window.location.pathname = '/';
//         }
//       }
  
//       return Promise.reject(error);
//     }
//   );
  

export default api
