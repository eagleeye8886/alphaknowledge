const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../config/database');

class User {
  constructor(userData) {
    this._id = userData._id || uuidv4();
    this.googleId = userData.googleId;
    this.name = userData.name;
    this.email = userData.email;
    this.profilePicture = userData.profilePicture;
    this.createdAt = userData.createdAt || new Date();
    this.lastLogin = userData.lastLogin || new Date();
  }

  static getCollection() {
    const db = getDB();
    return db.collection('users');
  }

  async save() {
    const collection = User.getCollection();
    
    try {
      const result = await collection.insertOne({
        _id: this._id,
        googleId: this.googleId,
        name: this.name,
        email: this.email,
        profilePicture: this.profilePicture,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
      });
      
      return this;
    } catch (error) {
      // If document already exists, update it
      if (error.message.includes('already exists')) {
        return await this.update();
      }
      throw error;
    }
  }

  async update() {
    const collection = User.getCollection();
    
    const result = await collection.updateOne(
      { _id: this._id },
      {
        $set: {
          googleId: this.googleId,
          name: this.name,
          email: this.email,
          profilePicture: this.profilePicture,
          lastLogin: this.lastLogin
        }
      }
    );
    
    return this;
  }

  static async findOne(query) {
    const collection = User.getCollection();
    const result = await collection.findOne(query);
    
    if (result) {
      return new User(result);
    }
    return null;
  }

  static async findById(id) {
    const collection = User.getCollection();
    const result = await collection.findOne({ _id: id });
    
    if (result) {
      return new User(result);
    }
    return null;
  }

  static async find(query = {}) {
    const collection = User.getCollection();
    const cursor = collection.find(query);
    const results = await cursor.toArray();
    
    return results.map(userData => new User(userData));
  }
}

module.exports = User;
