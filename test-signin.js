const BACKEND_URL = 'http://localhost:5000/api';

async function testSignIn() {
  console.log('🧪 Testing Sign In Flow...\n');

  try {
    console.log('1️⃣ Testing signin endpoint...');
    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin2@test.com',
        password: 'password123'
      })
    });

    const textResponse = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response Body:', textResponse);

    if (response.ok) {
      const data = JSON.parse(textResponse);
      console.log('\n✅ Sign in successful!');
      console.log('User Role:', data.user.role);
      console.log('Token:', data.token.substring(0, 50) + '...');
      console.log('Should redirect to:', data.user.role === 'admin' ? '/admin' : '/');
    } else {
      console.log('\n❌ Sign in failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSignIn();
