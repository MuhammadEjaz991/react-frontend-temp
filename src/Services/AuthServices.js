

import { useDispatch, useSelector } from "react-redux";
import API_ENDPOINT from "../EndPoint";
import { setStoreUserData } from "../features/inputValue/Inputvalue";
import http from "./httpServices";

// const apiEndpoint = "https://3877-2400-adc5-10a-4d00-79b6-d56-3bbc-1392.ngrok-free.app";

const userData = "user_data";

async function login(user) {
    return await http.post(`${API_ENDPOINT}/users/login`, user);
}


async function fetchData(user) {
    console.log('auth', user)
    return await http.post(`${API_ENDPOINT}/users/getImageDetails`, user);
}



function StoreUser(user, dispatch) {

    dispatch(setStoreUserData(user))
    // localStorage.setItem(userData, JSON.stringify(user));
}
async function StoreImageDetail(resultToStore) {

    return await http.post(`${API_ENDPOINT}/users/storeImageDetails`, resultToStore);
}


// function getCurrentUser() {
//     try {
//         return JSON.parse(localStorage.getItem(userData));
//     } catch (ex) {
//         return null;
//     }
// }

// function GetCurrentUser() {
//     return userData = useSelector(state => state.app.StoreUserData);
     
// }


function logout() {
    localStorage.removeItem(userData);
}

export default {
    login,
    // GetCurrentUser,
    StoreUser, logout,
    StoreImageDetail,
    fetchData
};
