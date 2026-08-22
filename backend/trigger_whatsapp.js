require('dotenv').config();
const mongoose = require('mongoose');
const Worker = require('./src/models/Worker');
const { autoProcessClaimForWorker } = require('./src/services/claimProcessor');
const { buildSimulatedTrigger } = require('./src/services/triggerService');

async function triggerMessage() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find the worker by phone number
    const worker = await Worker.findOne({ phone: '9121458655' });
    
    if (!worker) {
      console.log('No verified workers found to send a message to.');
      process.exit(1);
    }

    console.log(`Triggering WhatsApp message for ${worker.name} (${worker.phone})...`);

    // Build a simulated trigger result
    const simulated = buildSimulatedTrigger('flood', 3);
    const result = {
      anyTriggered: true,
      triggerType: simulated.triggerType,
      triggerLevel: simulated.triggerLevel,
      triggerSources: [{ source: 'CWC (simulated)', value: 'RED alert', confirmedAt: new Date() }],
      disruptionStart: simulated.disruptionStart,
      disruptionEnd: simulated.disruptionEnd
    };

    // Process the claim which sends the WhatsApp message
    await autoProcessClaimForWorker(worker, result);
    
    console.log('WhatsApp message sent successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to trigger message:', err);
    process.exit(1);
  }
}

triggerMessage();
