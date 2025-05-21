// src/stores/dataStore.js
import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    // Здесь будут храниться ваши данные
    uploadedData: [],
  }),
  actions: {
    // Действие для загрузки данных
    loadData(data) {
      this.uploadedData = data;
    },
    // Здесь могут быть другие действия для фильтрации, обновления и т.д.
  },
  // getters: {
  //   // Здесь могут быть геттеры для вычисляемых свойств (например, getProductById)
  // }
});