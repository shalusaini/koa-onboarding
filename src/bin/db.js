const { MongoClient, ServerApiVersion } = require('mongodb')

// Replace the placeholder with your Atlas connection string
const uri = 'mongodb://127.0.0.1:27017/demo'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_DATABASE_URL || uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

let models

async function connect () {
  if (client.isConnected) {
    return
  }

  await client.connect()
  client.isConnected = true;
  // eslint-disable-next-line no-console
  console.info('Connected successfully to mongodb!')

  models = {
    User: client.db().collection('users'),
    BlockAccess: client.db().collection('blockaccesses'),
  }
}

/**
 *
 * @returns {IMongoCollectionModels}
 */
function Models () {
  if (!models) {
    throw new Error('Client not connected!')
  }
  return models
}
module.exports = {
  client,
  connect,
  Models
}
