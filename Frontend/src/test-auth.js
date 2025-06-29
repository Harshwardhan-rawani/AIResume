// Test script to verify localStorage authentication
// Run this in browser console after implementing changes

console.log('Testing localStorage Authentication...');

// Test 1: Check if authToken exists
const token = localStorage.getItem('authToken');
console.log('Auth Token exists:', !!token);

if (token) {
  // Test 2: Validate JWT structure
  try {
    const parts = token.split('.');
    console.log('JWT has 3 parts:', parts.length === 3);
    
    // Test 3: Check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp < currentTime;
    console.log('Token is expired:', isExpired);
    console.log('Token expires at:', new Date(payload.exp * 1000));
    
    // Test 4: Check user info
    console.log('User email:', payload.email);
    console.log('User ID:', payload.userId);
    
  } catch (error) {
    console.error('Invalid JWT token:', error);
  }
}

// Test 5: Check userName
const userName = localStorage.getItem('userName');
console.log('User name stored:', userName);

// Test 6: Test API call with token
async function testApiCall() {
  try {
    const response = await fetch('/api/resume/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API call successful:', data);
    } else {
      console.log('API call failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('API call error:', error);
  }
}

if (token) {
  testApiCall();
}

console.log('Authentication test completed!'); 