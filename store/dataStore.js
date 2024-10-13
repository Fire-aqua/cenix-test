import { defineStore } from 'pinia'

export const dataStore = defineStore('store', {
  state: () => {
    return {
      data: new Map,
    }
  },
  actions: {
    setData(map) {
      this.data = map;
    },
  },
})