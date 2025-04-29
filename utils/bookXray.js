// utils/bookXray.js
const axios = require('axios');

// Simulate fetching available slots
async function getAvailableXraySlots({ preferredDate }) {
  console.log("📅 Fetching available X-ray slots for:", preferredDate);

  // Simulate slots
  const slots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"
  ];

  return slots;
}

// Simulate booking an appointment
async function bookXrayAppointment({ patientName, slot, location, serviceType }) {
  console.log(`📨 Sending booking request for ${patientName} at ${slot} in ${location} for ${serviceType}...`);

  // Imagine we have a real API here
  try {
    /*
    const response = await axios.post('https://api.hospital-booking.com/book', {
      patientName,
      slot,
      location,
      serviceType,
      preferredDate,
    });
    return response.data;
    */

    // Simulate success
    return { success: true, message: `Booking confirmed for ${patientName} at ${slot}.` };
  } catch (error) {
    console.error("❌ Failed to book:", error.message);
    return { success: false, message: "Failed to complete booking." };
  }
}

module.exports = {
  getAvailableXraySlots,
  bookXrayAppointment
};
