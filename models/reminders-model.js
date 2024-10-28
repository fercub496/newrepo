const pool = require("../database/")

async function createReminder(accountId, title, description, reminderDate) {
    const query = `INSERT INTO reminders (user_id, title, description, reminder_date) VALUES ($1, $2, $3, $4) RETURNING *`
    const values = [accountId, title, description, reminderDate]
    const result = await pool.query(query, values)
    return result.rows[0]
}

async function getRemindersByAccount(accountId) {
    const query = `SELECT * FROM reminders WHERE user_id = $1 ORDER BY reminder_date`
    const result = await pool.query(query, [accountId])
    return result.rows
}

async function updateReminder(reminderId, title, description, reminderDate) {
    const query = `
      UPDATE reminders 
      SET title = $1, description = $2, reminder_date = $3 
      WHERE reminder_id = $4 RETURNING *`
    const value = [title, description, reminderDate, reminderId]
    const result = await pool.query(query, value)
    return result.rows[0]
  }

  async function deleteReminder(reminderId) {
    const query = `DELETE FROM reminders WHERE reminder_id = $1 RETURNING *`
    const result = await pool.query(query, [reminderId])
    return result.rows[0]
  }

module.exports = {createReminder,getRemindersByAccount,updateReminder,deleteReminder}