import {
  Account,
  Client,
  Databases,
  Functions
} from 'appwrite'

const {
  endpoint,
  projectId,
  dbId
} = process.env.APPWRITE
const client = new Client()
const account = new Account(client)
const databases = new Databases(client)
const functions = new Functions(client)

client.setEndpoint(endpoint).setProject(projectId)

// monkey-patch this to
// - parse result
// - handle errors gracefully with our useLoading
const createExecution = functions.createExecution

functions.createExecution = async function (...args) {
  const execution = await createExecution.apply(this, args)
  let result = null

  try {
    result = JSON.parse(execution.response)
  } catch (error) {
    result = execution.response
  }

  // https://appwrite.io/docs/models/execution
  if (execution.status === 'failed') {
    throw new Error(result.statusMessage || result)
  }

  return result
}

export {
  account,
  client,
  databases,
  dbId,
  functions
}
