const remindersModel = require('../models/reminders-model')
const utilities = require("../utilities/")

async function viewReminders(req, res) {
    try {
      let nav = await utilities.getNav()
      const accountId = req.user.account_id
      const reminders = await remindersModel.getRemindersByAccount(accountId)
      res.render("reminder/reminder-list", {title: "Reminders" ,nav, reminders,errors: null })
    } catch (error) {
      console.error("Error fetching reminders:", error)
      res.redirect("/error500")
    }
  }

async function createReminder(req, res) {
    try {
      const accountId = req.user.account_id
      const { title, description, reminderDate } = req.body
      await remindersModel.createReminder(accountId, title, description, reminderDate)
      res.redirect("/reminders")
    } catch (error) {
      console.error("Error creating reminder:", error)
      res.redirect("/error500")
    }
  }
  async function updateReminder(req, res) {
    try {
      const reminderId = req.params.id
      const { title, description, reminderDate } = req.body
      await remindersModel.updateReminder(reminderId, title, description, reminderDate)
      res.redirect("/reminders")
    } catch (error) {
      console.error("Error updating reminder:", error)
      res.redirect("/error500")
    }
  }

  async function deleteReminder(req, res) {
    try {
      const reminderId = req.params.id
      await remindersModel.deleteReminder(reminderId)
      res.redirect("/reminders")
    } catch (error) {
      console.error("Error deleting reminder:", error)
      res.redirect("/error500")
    }
  }


module.exports = {viewReminders, createReminder , updateReminder, deleteReminder}