// Test Route Calculation API
const testRouteAPI = async () => {
  const token = 'YOUR_TOKEN_HERE'; // Replace with actual token from localStorage

  const response = await fetch('http://localhost:5004/api/routes/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      origin: {
        coordinates: [79.8612, 6.9271], // Galle Face, Colombo
        address: 'Galle Face, Colombo'
      },
      destination: {
        coordinates: [80.6337, 7.2906], // Kandy
        address: 'Kandy City'
      }
    })
  });

  const data = await response.json();
  console.log('Response:', data);
};

// To test, copy your token from browser localStorage and run:
// testRouteAPI();

console.log('Test file loaded. Instructions:');
console.log('1. Open browser console on SafeRoute page');
console.log('2. Run: localStorage.getItem("token")');
console.log('3. Copy the token');
console.log('4. Replace YOUR_TOKEN_HERE in this file');
console.log('5. Run: testRouteAPI()');
