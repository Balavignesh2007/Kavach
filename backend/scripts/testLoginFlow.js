const axios = require('axios');

async function testFlow(phone, name) {
  console.log(`\n--- Testing Flow for ${phone} (${name}) ---`);
  try {
    // 1. Send OTP
    console.log(`1. Requesting OTP for ${phone}...`);
    const otpRes = await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
    const otp = otpRes.data.devOtp;
    console.log(`   OTP Sent successfully (mocked response for dev: ${otp})`);
    
    // Wait for the WhatsApp message to process
    await new Promise(r => setTimeout(r, 2000));

    // 2. Verify OTP
    console.log(`2. Verifying OTP for ${phone}...`);
    const verifyRes = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone, otp });
    console.log(`   OTP Verified! isNewWorker: ${verifyRes.data.isNewWorker}`);

    // Wait for the WhatsApp message to process
    await new Promise(r => setTimeout(r, 2000));

    // 3. Register (if new) to complete the signup flow and get the proper welcome message
    if (verifyRes.data.isNewWorker) {
      console.log(`3. Registering ${name}...`);
      await axios.post('http://localhost:5000/api/auth/register', {
        phone,
        name,
        aadhaarLast4: '1234',
        platforms: [{ name: 'zomato' }],
        city: 'mumbai',
        zone: 'bandra',
        declaredWeeklyIncome: 5000,
      });
      console.log(`   Registration complete!`);
    }

  } catch (error) {
    console.error(`Error processing ${phone}:`, error.response ? error.response.data : error.message);
  }
}

async function run() {
  await testFlow('9121458655', 'Rahul');
  await new Promise(r => setTimeout(r, 4000)); // Sleep between different numbers to prevent rate limiting
  await testFlow('9030252566', 'Amit');
  console.log('\nAll login/signup flows completed successfully!');
}

run();
