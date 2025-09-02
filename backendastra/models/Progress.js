const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../config/database');

class Progress {
  constructor(progressData) {
    this._id = progressData._id || uuidv4();
    this.userId = progressData.userId;
    this.problemId = progressData.problemId;
    this.sheetId = progressData.sheetId;
    this.sectionId = progressData.sectionId;
    this.subsectionId = progressData.subsectionId;
    this.difficulty = progressData.difficulty;
    this.isCompleted = progressData.isCompleted || false;
    this.completedAt = progressData.completedAt;
    this.updatedAt = progressData.updatedAt || new Date();
  }

  static getCollection() {
    const db = getDB();
    return db.collection('progress');
  }

  async save() {
    const collection = Progress.getCollection();
    
    try {
      const result = await collection.insertOne({
        _id: this._id,
        userId: this.userId,
        problemId: this.problemId,
        sheetId: this.sheetId,
        sectionId: this.sectionId,
        subsectionId: this.subsectionId,
        difficulty: this.difficulty,
        isCompleted: this.isCompleted,
        completedAt: this.completedAt,
        updatedAt: this.updatedAt
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
    const collection = Progress.getCollection();
    
    const result = await collection.updateOne(
      { _id: this._id },
      {
        $set: {
          userId: this.userId,
          problemId: this.problemId,
          sheetId: this.sheetId,
          sectionId: this.sectionId,
          subsectionId: this.subsectionId,
          difficulty: this.difficulty,
          isCompleted: this.isCompleted,
          completedAt: this.completedAt,
          updatedAt: this.updatedAt
        }
      }
    );
    
    return this;
  }

  static async findOne(query) {
    const collection = Progress.getCollection();
    const result = await collection.findOne(query);
    
    if (result) {
      return new Progress(result);
    }
    return null;
  }

  static async findById(id) {
    const collection = Progress.getCollection();
    const result = await collection.findOne({ _id: id });
    
    if (result) {
      return new Progress(result);
    }
    return null;
  }

  static async find(query = {}, options = {}) {
    const collection = Progress.getCollection();
    let cursor = collection.find(query);
    
    if (options.sort) {
      cursor = cursor.sort(options.sort);
    }
    
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }
    
    const results = await cursor.toArray();
    return results.map(progressData => new Progress(progressData));
  }

  static async bulkWrite(operations) {
    const collection = Progress.getCollection();
    
    // Convert Mongoose-style bulk operations to Astra DB operations
    const promises = operations.map(async (op) => {
      if (op.updateOne) {
        const { filter, update, upsert } = op.updateOne;
        
        if (upsert) {
          try {
            await collection.updateOne(filter, update);
            return { modifiedCount: 1 };
          } catch (error) {
            // If document doesn't exist, insert it
            const docToInsert = { ...filter, ...update.$set, _id: uuidv4() };
            await collection.insertOne(docToInsert);
            return { upsertedCount: 1 };
          }
        } else {
          const result = await collection.updateOne(filter, update);
          return result;
        }
      }
    });
    
    const results = await Promise.all(promises);
    
    return {
      modifiedCount: results.reduce((sum, r) => sum + (r.modifiedCount || 0), 0),
      upsertedCount: results.reduce((sum, r) => sum + (r.upsertedCount || 0), 0)
    };
  }
}

module.exports = Progress;
