const {
  Client,
  Databases,
  ID,
  Permission,
  Role,
  Teams
} = require('node-appwrite')

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
    const { id, userId } = JSON.parse(req.payload)

    if (!id) {
      return res.json('ID is required', 400)
    } else if (!userId) {
      return res.json('User ID is required', 400)
    }

    const { memberships } = await teams.listMemberships(id)
    let membership = memberships.find(membership => membership.userId === userId)

    if (!membership) {
      membership = await teams.createMembership(
        id,
        null,
        null,
        userId,
        null,
        ['member'],
        `https://potluck.my/events/${id}`
      )
    }

    res.json(membership.$id)
  } catch (error) {
    console.error(error)
    res.json(error, 500)
  }
}
