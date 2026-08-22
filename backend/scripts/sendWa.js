const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { sendMessage } = require('../src/services/notificationService');

async function run() {
  const to = '9121458655';
  const msg = 'Namaste! This is a test message from KAVACH - Your AI Income Shield.';
  console.log(`Sending message to ${to}...`);
  const res = await sendMessage(to, msg);
  console.log('Result:', res);
}

run();
