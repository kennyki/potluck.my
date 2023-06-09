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
    id: null,
    metadata: null,
    items: [],
    unsubscribeToEvent: null
  }),
  getters: {
    isLoaded (state) {
      return !!state.id
    }
  },
  actions: {
    create ({ name, notice }) {
      const userStore = useUserStore()
      const params = JSON.stringify({
        name,
        notice,
        hostId: userStore.id,
        hostName: userStore.name
      })

      return functions.createExecution('createEvent', params)
    },
    updateMetadata ({ name, notice }) {
      const data = Object.assign({ ...this.metadata.data }, { name, notice })

      return databases.updateDocument(
        dbId,
        this.id,
        this.metadata.$id,
        { data: JSON.stringify(data) }
      )
    },
    createItem ({ title }) {
      const userStore = useUserStore()
      const creatorId = userStore.id
      const hostId = this.metadata.creatorId

      return databases.createDocument(
        dbId,
        this.id,
        ID.unique(),
        {
          type: ItemType.item,
          data: JSON.stringify({ title }),
          creatorId,
          creatorName: userStore.name
        },
        [
          Permission.update(Role.user(creatorId)),
          Permission.delete(Role.user(creatorId))
        ]
      )
    },
    updateItem (item, { title }) {
      const data = Object.assign({ ...item.data }, { title })

      return databases.updateDocument(
        dbId,
        this.id,
        item.$id,
        { data: JSON.stringify(data) }
      )
    },
    deleteItem (item) {
      return databases.deleteDocument(
        dbId,
        this.id,
        item.$id
      )
    },
    rejectItem (item) {
      return databases.updateDocument(
        dbId,
        this.id,
        item.$id,
        { status: ItemStatus.rejected }
      )
    },
    acceptItem (item) {
      return databases.updateDocument(
        dbId,
        this.id,
        item.$id,
        { status: ItemStatus.active }
      )
    },
    async load ({ id, status = ItemStatus.active }) {
      // load everything
      const documents = await this._load({ id, status })
      const data = {
        id,
        metadata: null,
        items: [],
        unsubscribeToEvent: null
      }

      documents.forEach(doc => {
        doc = this._parseDoc(doc)

        if (!doc) {
          return
        }

        switch (doc.type) {
          case ItemType.metadata:
            // only take the first for metadata
            data.metadata ||= doc
            break
          case ItemType.item:
            data.items.push(doc)
            break
        }
      })

      data.unsubscribeToEvent = this._subscribeToEvent(id)

      this.$patch(data)
    },
    async loadItems ({ id, status }) {
      const documents = await this._load({ id, status, type: ItemType.item })
      const items = []

      documents.forEach(doc => {
        doc = this._parseDoc(doc)

        if (doc) {
          items.push(doc)
        }
      })

      this.$patch({ items })
    },
    async _load ({ id, status, type }, page = 1) {
      const offset = (page - 1) * PAGE_LIMIT
      const queries = [
        Query.orderAsc('$createdAt'),
        Query.limit(PAGE_LIMIT),
        Query.offset(offset)
      ]

      if (status) {
        queries.push(Query.equal('status', status))
      }

      if (type) {
        queries.push(Query.equal('type', type))
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
    _subscribeToEvent (id) {
      return client.subscribe(`databases.${dbId}.collections.${id}.documents`, async (data) => {
        const { events, payload } = data
        const action = events[0]?.split('.').pop()
        const type = payload.type

        // ignore 'create' or 'delete'
        // which definitely is not a proper change (from the app UI)
        if (type === ItemType.metadata && action === 'update') {
          const updates = this._parseDoc(payload)

          if (updates) {
            Object.assign(this.metadata, updates)
          }

          return
        }

        const listName = `${type}s`

        if (!this[listName]) {
          return console.warn(`Invalid event data type: ${type}`)
        }

        const handler = this[`_${action}Doc`]

        if (handler) {
          handler.call(this, listName, payload)
        }
      })
    },
    _createDoc (listName, doc) {
      doc = this._parseDoc(doc)

      if (doc && doc.status === ItemStatus.active) {
        this[listName].push(doc)
      }
    },
    _updateDoc (listName, updates) {
      const id = updates.$id
      const doc = this[listName].find(doc => doc.$id === id)

      updates = this._parseDoc(updates)

      if (!updates) {
        return
      }

      if (doc) {
        Object.assign(doc, updates)
      } else {
        this[listName].push(doc)
        this[listName].sort((a, b) => {
          return a.$createdAt < b.$createdAt ? -1 : (a.$createdAt > b.$createdAt ? 1 : 0)
        })
      }
    },
    _deleteDoc (listName, doc) {
      const id = doc.$id

      this.$patch({
        [listName]: this[listName].filter(doc => doc.$id !== id)
      })
    },
    _parseDoc (doc) {
      try {
        doc.data = JSON.parse(doc.data)
        return doc
      } catch (error) {
        console.error(`Found corrupted data on ${doc.$id}`)
        console.error(error)
      }
    },
    unload () {
      if (this.unsubscribeToEvent) {
        this.unsubscribeToEvent()
      }
      this.$reset()
    }
  }
})
