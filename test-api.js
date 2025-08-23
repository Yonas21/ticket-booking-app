const http = require('http');

const BASE_URL = 'http://localhost:8080';

// Test function
async function testAPI() {
  console.log('Testing Backend API...\n');

  // Test 1: Search trips
  console.log('1. Testing trip search...');
  try {
    const searchResponse = await makeRequest('/api/trips/search?from=Addis%20Ababa&to=Adama&date=2025-08-16');
    console.log('✅ Trip search successful:', searchResponse.length, 'trips found');
  } catch (error) {
    console.log('❌ Trip search failed:', error.message);
  }

  // Test 2: Get specific trip
  console.log('\n2. Testing get trip by ID...');
  try {
    const tripResponse = await makeRequest('/api/trips/1');
    console.log('✅ Get trip successful:', tripResponse.from, 'to', tripResponse.to);
  } catch (error) {
    console.log('❌ Get trip failed:', error.message);
  }

  // Test 3: Test signup (this should work)
  console.log('\n3. Testing user signup...');
  try {
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    const signupResponse = await makeRequest('/api/auth/signup', 'POST', signupData);
    console.log('✅ Signup successful:', signupResponse.message);
  } catch (error) {
    console.log('❌ Signup failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
}

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || body}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Run the test
testAPI().catch(console.error);
