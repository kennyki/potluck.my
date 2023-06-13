import { defineStore } from 'pinia'
import {
  ID,
  Permission,
  Query,
  Role
} from 'appwrite'
import {
  client,
  databases,
  dbId,
  functions
} from 'boot/appwrite'
import { useUserStore } from 'stores/user'

// TODO: change to 999999 when Appwrite Cloud is updated to >= 1.3
const PAGE_LIMIT = 100

export const ItemStatus = {
  active: 'active',
  rejected: 'rejected'
}

export const ItemType = {
  metadata: 'metadata',
  item: 'item'
}

export const useEventStore = defineStore('event', {
  state: () => ({
    metadata: null,
    items: [],
    unsubscribeToMetadata: null,
    unsubscribeToItems: null
  }),
  getters: {
    id (state) {
      return state.metadata?.id
    },
    isLoaded (state) {
      return !!this.id
    }
  },
  actions: {
    async create ({ name, notice }) {
      // TODO: transaction
      const event = await databases.createDocument(
        dbId,
        'events',
        ID.unique(),
        { name, notice }
      )
      const eventId = event.$id
      const team = await teams.create(
        eventId,
        eventId,
        ['owner']
      )
      const teamId = team.$id

      return databases.updateDocument(
        dbId,
        'events',
        eventId,
        {},
        [
          Permission.read(Role.team(teamId)),
          Permission.update(Role.team(teamId, 'owner'))
        ]
      )
    },
    updateMetadata ({ name, notice }) {
      return databases.updateDocument(
        dbId,
        'events',
        this.id,
        { name, notice }
      )
    },
    createItem ({ title }) {
      const userStore = useUserStore()
      const creatorId = userStore.id
      const eventId = this.id

      return databases.createDocument(
        dbId,
        'items',
        ID.unique(),
        {
          title,
          creatorId,
          eventId
        },
        [
          Permission.update(Role.team(eventId, 'owner')),
          Permission.delete(Role.team(eventId, 'owner')),
          Permission.delete(Role.user(creatorId))
        ]
      )
    },
    updateItem (item, { title }) {
      return databases.updateDocument(
        dbId,
        'items',
        item.$id,
        { title }
      )
    },
    deleteItem (item) {
      return databases.deleteDocument(
        dbId,
        'items',
        item.$id
      )
    },
    rejectItem (item) {
      return databases.updateDocument(
        dbId,
        'items',
        item.$id,
        { status: ItemStatus.rejected }
      )
    },
    acceptItem (item) {
      return databases.updateDocument(
        dbId,
        'items',
        item.$id,
        { status: ItemStatus.active }
      )
    },
    async load ({ id, status = ItemStatus.active }) {
      const userStore = useUserStore()
      const userId = userStore.id
      const params = JSON.stringify({
        id,
        userId
      })

      await functions.createExecution('ensureEventMembership', params)

      const metadata = await databases.getDocument(
        dbId,
        'events',
        id
      )

      this.$patch({
        metadata,
        items: [],
        unsubscribeToMetadata: this._subscribeToMetadata(id),
        unsubscribeToItems: this._subscribeToItems(id)
      })

      return this.loadItems({ id, status })
    },
    async loadItems ({ id, status }) {
      const items = await this._loadItems({ id, status })

      this.$patch({ items })
    },
    async _loadItems ({ id, status }, page = 1) {
      const offset = (page - 1) * PAGE_LIMIT
      const queries = [
        Query.orderAsc('$createdAt'),
        Query.limit(PAGE_LIMIT),
        Query.offset(offset)
      ]

      if (status) {
        queries.push(Query.equal('status', status))
      }

      const { documents } = await databases.listDocuments(
        dbId,
        id,
        queries
      )

      // try load the next page recursively
      if (documents.length === PAGE_LIMIT) {
        const nextDocuments = await this._load({ id, status }, page + 1)
        documents.push(...nextDocuments)
      }

      return documents
    },
    _subscribeToMetadata (id) {
      return client.subscribe(`databases.${dbId}.collections.events.documents.${id}`, (data) => {
        const { events, payload } = data
        const action = events[0]?.split('.').pop()

        if (action === 'update') {
          this.$patch({
            metadata: payload
          })
        }
      })
    },
    _subscribeToItems (id) {
      return client.subscribe(`databases.${dbId}.collections.items.documents`, async (data) => {
        const { events, payload } = data
        const action = events[0]?.split('.').pop()
        const handler = this[`_${action}Item`]

        if (handler && payload.eventId === id) {
          handler.call(this, payload)
        }
      })
    },
    _createItem (item) {
      if (item.status === ItemStatus.active) {
        this.items.push(item)
      }
    },
    _updateItem (updates) {
      const id = updates.$id
      const item = this.items.find(item => item.$id === id)

      if (updates.status !== ItemStatus.active) {
        return this._deleteItem(updates)
      }

      if (item) {
        Object.assign(item, updates)
      } else {
        this.items.push(updates)
        this.items.sort((a, b) => {
          return a.$createdAt < b.$createdAt ? -1 : (a.$createdAt > b.$createdAt ? 1 : 0)
        })
      }
    },
    _deleteItem (item) {
      const id = item.$id

      this.$patch({
        items: this.items.filter(item => item.$id !== id)
      })
    },
    unload () {
      if (this.unsubscribeToMetadata) {
        this.unsubscribeToMetadata()
      }
      if (this.unsubscribeToItems) {
        this.unsubscribeToItems()
      }
      this.$reset()
    }
  }
})
