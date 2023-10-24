// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import counterReducerinput from '../features/inputValue/Inputvalue';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses localStorage; if you want to use other storage, they are available too.

// Persist config
const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, counterReducerinput);

const store = configureStore({
    reducer: {
        app: persistedReducer
    },
});

export const persistor = persistStore(store);

export default store;
