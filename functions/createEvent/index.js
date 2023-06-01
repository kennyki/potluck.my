const {
  Client,
  Databases,
  ID,
  Permission,
  Role,
  Teams
} = require('node-appwrite')

const STRING_XS = 32
const STRING_SM = 128
const STRING_MD = 255
// https://github.com/appwrite/appwrite/issues/3386#issuecomment-1157707278
const STRING_MAX = 16777216

function sleep () {
  return new Promise(r => setTimeout(r, 500))
}

module.exports = async (req, res) => {
  const client = new Client()
  const databases = new Databases(client)
  const teams = new Teams(client)

  client
    .setEndpoint(req.variables['API_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['API_KEY'])

  const dbId = req.variables['DB_ID']

  try {
    const { name, host, notice } = JSON.parse(req.payload)

    if (!name) {
      return res.json('Name is required', 400)
    } else if (!host) {
      return res.json('Host is required', 400)
    }

    // TODO: transaction
    const collection = await databases.createCollection(
      dbId,
      ID.unique(),
      `${host}-${Date.now()}`,
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.user(host))
      ],
      true
    )
    const eventId = collection.$id

    await Promise.all([
      // ['metadata', 'item']
      databases.createStringAttribute(
        dbId,
        eventId,
        'type',
        STRING_XS,
        true
      ),
      databases.createStringAttribute(
        dbId,
        eventId,
        'data',
        STRING_MAX,
        true
      ),
      databases.createStringAttribute(
        dbId,
        eventId,
        'creator',
        STRING_MD,
        true
      ),
      // ['active', 'hidden']
      databases.createStringAttribute(
        dbId,
        eventId,
        'status',
        STRING_XS,
        false,
        'active'
      )
    ])
    // TODO: how to better wait for the attributes to become 'available'
    await sleep()
    await Promise.all([
      databases.createIndex(
        dbId,
        eventId,
        'status',
        'key',
        ['status']
      )
    ])

    await databases.createDocument(
      dbId,
      eventId,
      ID.unique(),
      {
        type: 'metadata',
        data: JSON.stringify({ name, host, notice }),
        creator: host
      },
      [
        Permission.read(Role.users()),
        Permission.update(Role.user(host))
      ]
    )

    res.json(eventId)
  } catch (error) {
    console.error(error)
    res.json(error, 500)
  }
}
