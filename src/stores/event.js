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

// TODO: change to 999999 when Appwrite Cloud is updated to >= 1.3
const PAGE_LIMIT = 100

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
    },
    async load ({ id, status = 'active' }) {
      // load everything
      const documents = await this._load({ id, status })
      // map by type
      // but we will only take the first for metadata
      const data = {
        metadata: null,
        notices: [],
        items: []
      }

      documents.forEach(doc => {
        try {
          doc.data = JSON.parse(doc.data)

          switch (doc.type) {
            case 'metadata':
              data.metadata ||= doc
              break
            case 'notice':
              data.notices.push(doc)
              break
            case 'item':
              data.items.push(doc)
              break
          }
        } catch (error) {
          console.error(`Found corrupted data on ${id} / ${doc.$id}`)
          console.error(error)
        }
      })

      this.$patch({ data })
    },
    async _load ({ id, status }, page = 1) {
      const offset = (page - 1) * PAGE_LIMIT
      const { documents } = await databases.listDocuments(
        dbId,
        id,
        [
          Query.equal('status', status),
          Query.orderAsc('$createdAt'),
          Query.limit(PAGE_LIMIT),
          Query.offset(offset)
        ]
      )

      // try load the next page recursively
      if (documents.length === PAGE_LIMIT) {
        const nextDocuments = await this._load({ id, status }, page + 1)
        documents.push(...nextDocuments)
      }

      return documents
    },
    unload () {
      this.$reset()
    }
  }
})
