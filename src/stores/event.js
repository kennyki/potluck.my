import { defineStore } from 'pinia'
import {
  ID,
  Permission,
  Query,
  Role
} from 'appwrite'
import {
  databases,
  dbId,
  functions
} from 'boot/appwrite'
import { useUserStore } from 'stores/user'

export const useEventStore = defineStore('event', {
  state: () => ({
    data: null
  }),
  getters: {
    isLoaded (state) {
      return !!state.data
    }
  },
  actions: {
    create ({ name }) {
      const userStore = useUserStore()
      const params = JSON.stringify({
        name,
        host: userStore.account.$id
      })

      return functions.createExecution('createEvent', params)
    }
  }
})
