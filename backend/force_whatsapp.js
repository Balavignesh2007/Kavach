require('dotenv').config();
const { sendMessage } = require('./src/services/notificationService');

async function forceMessage() {
  const numbers = ['9121458655', '9030252566', '9346758232'];
  
  const msg = 
    `Disruption Alert\n\n` +
    `Heavy Rainfall detected in your zone (Level 3).\n\n` +
    `Your income is protected. If deliveries stop, your payout will be processed automatically - no action needed from you.\n\n` +
    `Stay safe!`;

  for (const num of numbers) {
    try {
      console.log(`Sending WhatsApp message to ${num}...`);
      const res = await sendMessage(num, msg);
      console.log(`Response for ${num}:`, res);
    } catch (err) {
      console.error(`Failed to send to ${num}:`, err);
    }
  }
}

forceMessage();
