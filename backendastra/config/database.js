const { DataAPIClient } = require('@datastax/astra-db-ts');

let db;

const connectToAstra = async () => {
  try {
    const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
    db = client.db(process.env.ASTRA_DB_API_ENDPOINT);
    
    // Create collections if they don't exist
    await createCollectionsIfNeeded();
    
    console.log('Connected to Astra DB and collections verified');
    return db;
  } catch (error) {
    console.error('Astra DB connection error:', error);
    process.exit(1);
  }
};

const createCollectionsIfNeeded = async () => {
  try {
    // List existing collections
    const collections = await db.listCollections({ nameOnly: true });
    const collectionNames = collections.map(c => c.name);
    
    // Create users collection if it doesn't exist
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Created users collection');
    }
    
    // Create progress collection if it doesn't exist
    if (!collectionNames.includes('progress')) {
      await db.createCollection('progress');
      console.log('Created progress collection');
    }
    
  } catch (error) {
    console.error('Error creating collections:', error);
    // Don't exit here, let the app continue and handle individual collection errors
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToAstra first.');
  }
  return db;
};

module.exports = { connectToAstra, getDB };
