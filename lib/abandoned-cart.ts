// Tracks cart state and sends WhatsApp reminder after inactivity
export function scheduleAbandonedCartReminder() {
  const lastActivity = localStorage.getItem("viajero_cart_activity")
  const now = Date.now()
  localStorage.setItem("viajero_cart_activity", now.toString())
  
  // If cart existed >30min ago and user never checked out
  if (lastActivity && now - parseInt(lastActivity) > 1800000) {
    const reminderSent = localStorage.getItem("viajero_cart_reminder_sent")
    if (!reminderSent) {
      localStorage.setItem("viajero_cart_reminder_sent", "true")
      return true // signal that reminder should be sent
    }
  }
  return false
}

export function clearCartActivity() {
  localStorage.removeItem("viajero_cart_activity")
  localStorage.removeItem("viajero_cart_reminder_sent")
}
