// Simple test script to check if APIs are working
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...');

    // Test basic API
    const testResponse = await fetch('http://localhost:3000/api/test');
    const testData = await testResponse.json();

    console.log('✅ Test API:', testResponse.status, testData);

    // Test mood API (should return 401 without auth)
    const moodResponse = await fetch('http://localhost:3000/api/mood');
    const moodData = await moodResponse.json();

    console.log('✅ Mood API:', moodResponse.status, moodData);
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

testAPI();
