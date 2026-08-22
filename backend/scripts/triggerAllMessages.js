const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { 
  notifyPolicyActivated,
  notifyClaimAutoApproved,
  notifyClaimSoftFlag,
  notifyClaimVerificationNeeded,
  notifyClaimManualReview,
  notifyWeeklyPremiumDue,
  notifyDisruptionAlert
} = require('../src/services/notificationService');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const worker = { name: 'Rahul', phone: '9121458655' };
  const policy = { tier: 'premium', coveragePct: 0.85, maxPayout: 1500, weekEnd: new Date(), premium: { finalAmount: 150 } };
  const claim = { payoutAmount: 1275, triggerType: 'rain', predictedLoss: 1500, policy: policy };
  const payout = { id: 'UPI123456789' };

  console.log('Triggering notifyPolicyActivated...');
  await notifyPolicyActivated(worker, policy);
  await sleep(2000); // Sleep to prevent rate limiting

  console.log('Triggering notifyWeeklyPremiumDue...');
  await notifyWeeklyPremiumDue(worker, policy);
  await sleep(2000);

  console.log('Triggering notifyDisruptionAlert...');
  await notifyDisruptionAlert(worker, 'rain', 3);
  await sleep(2000);

  console.log('Triggering notifyClaimAutoApproved...');
  await notifyClaimAutoApproved(worker, claim, payout);
  await sleep(2000);

  console.log('Triggering notifyClaimSoftFlag...');
  await notifyClaimSoftFlag(worker, claim);
  await sleep(2000);

  console.log('Triggering notifyClaimVerificationNeeded...');
  await notifyClaimVerificationNeeded(worker, claim);
  await sleep(2000);

  console.log('Triggering notifyClaimManualReview...');
  await notifyClaimManualReview(worker, claim);

  console.log('All messages triggered successfully!');
}

run().catch(console.error);
