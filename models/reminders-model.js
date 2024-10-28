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

module.exports = {createReminder,getRemindersByAccount}