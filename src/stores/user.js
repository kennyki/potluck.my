import { defineStore } from 'pinia'
import {
  account
} from 'boot/appwrite'

export const useUserStore = defineStore('user', {
  state: () => ({
    account: null
  }),
  getters: {
    isLoggedIn (state) {
      return !!state.account
    },
    id (state) {
      return state.account?.$id
    },
    name (state) {
      return state.account?.name
    }
  },
  actions: {
    async init () {
      try {
        const accountObj = await account.get()

        this.$patch({
          account: accountObj
        })
      } catch (e) {
        if (e.code !== 401) {
          throw e
        }
      }
    },
    async login ({ name }) {
      await account.createAnonymousSession()
      await this.init()
      return this.update({ name })
    },
    async logout () {
      await account.deleteSession('current')
      this.$reset()
    },
    async update ({ name }) {
      if (name) {
        const updates = await account.updateName(name)

        this.$patch({
          account: Object.assign(this.account, updates)
        })
      }
    }
  }
})
