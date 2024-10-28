const remindersModel = require('../models/reminders-model')
const utilities = require("../utilities/")

async function viewReminders(req, res) {
    try {
      let nav = await utilities.getNav()
      const accountId = req.user.account_id
      const reminders = await remindersModel.getRemindersByAccount(accountId)
      res.render("reminder/reminder-list", {title: "Reminders" ,nav, reminders,errors: null })
    } catch (error) {
      req.flash("notice", "Sorry. No display is possible at the moment.")
      console.error("Error fetching reminders:", error)
      res.redirect("/error500")
    }
  }

async function createReminder(req, res) {
    try {
      const accountId = req.user.account_id
      const { title, description, reminderDate } = req.body
      await remindersModel.createReminder(accountId, title, description, reminderDate)
      req.flash("notice", "Your reminder was created successfully.")
      res.redirect("/reminders")
    } catch (error) {
      req.flash("notice", "Sorry. Your reminder could not be added.")
      console.error("Error creating reminder:", error)
      res.redirect("/error500")
    }
  }
  async function updateReminder(req, res) {
    try {
      const reminderId = req.params.id
      const { title, description, reminderDate } = req.body
      await remindersModel.updateReminder(reminderId, title, description, reminderDate)
      req.flash("notice", "Your reminder has been updated successfully.")
      res.redirect("/reminders")
    } catch (error) {
     req.flash("notice", "Your reminder could not be updated.")
      console.error("Error updating reminder:", error)
      res.redirect("/error500")
    }
  }

  async function deleteReminder(req, res) {
    try {
      const reminderId = req.params.id
      await remindersModel.deleteReminder(reminderId)
      req.flash("notice", "Your reminder has been deleted at all.")
      res.redirect("/reminders")
    } catch (error) {
        req.flash("notice", "Your reminder could not be deleted.")
      console.error("Error deleting reminder:", error)
      res.redirect("/error500")
    }
  }


module.exports = {viewReminders, createReminder , updateReminder, deleteReminder}