const db = require('../config/db');

class User {
  static async create(username, password) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }
  
  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0]; // Return the first row (user object)
  }

  static async findAllExcept(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id != ?', [userId]);
    return rows;
  }

  static async searchByUsername(username) {
    console.log("Searching for username:", username); // Debugging
  
    const [rows] = await db.execute(
      'SELECT id, username FROM users WHERE LOWER(username) LIKE LOWER(?)',
      [`%${username}%`]
    );
  
    console.log("Search results:", rows); // Debugging
    return rows;
  }

  static async updateAbout(userId,about){
    const [rows] = await db.execute(
      'UPDATE users SET about = ? WHERE id = ?', [about, userId]
    );
    return rows;
  };

  static async updateName(userId,name){
    const [rows] = await db.execute(
      'UPDATE users SET username = ? WHERE id = ?', [name, userId]
    );
    return rows;
  };

  static async updateAvatar(userId,avatar){
    const [rows] = await db.execute(
      'UPDATE users SET avatar_url = ? WHERE id = ?', [avatar, userId]
    );
    return rows;
  };

  static async updateOnlineStatus(userId, isOnline) {
    await db.execute('UPDATE users SET is_online = ?,updated_at = NOW() WHERE id = ?', [isOnline, userId]);
  }

  static async findAllExceptFriends(userId) {
    const [rows] = await db.execute(
      `SELECT * FROM users 
       WHERE id != ? 
       AND id NOT IN (
         SELECT friend_id FROM friends WHERE user_id = ?
       )`,
      [userId, userId]
    );
    return rows;
  }  
  
}

module.exports = User;