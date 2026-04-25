// Test script to create users and test role display
const BACKEND_URL = 'http://localhost:5000/api';

async function testRoles() {
  console.log('🧪 Testing User Roles...\n');

  // Test 1: Create a regular user
  console.log('1️⃣ Creating regular user...');
  try {
    const signupRes = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'regularuser2',
        email: 'user2@test.com',
        password: 'password123'
      })
    });
    const signupData = await signupRes.json();
    console.log('Full response:', JSON.stringify(signupData, null, 2));
    if (signupData.user) {
      console.log('✅ Regular user created:', signupData.user);
      console.log('   Role:', signupData.user.role);
    }
  } catch (error) {
    console.error('❌ Error creating regular user:', error.message);
  }

  console.log('\n2️⃣ Creating admin user...');
  try {
    const signupRes = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'adminuser2',
        email: 'admin2@test.com',
        password: 'password123'
      })
    });
    const signupData = await signupRes.json();
    console.log('Full response:', JSON.stringify(signupData, null, 2));
    const adminToken = signupData.token;
    if (signupData.user) {
      console.log('✅ Admin user created:', signupData.user);
      console.log('   Initial Role:', signupData.user.role);
    }

    // Set this user as admin
    console.log('\n3️⃣ Setting admin user role to "admin"...');
    const roleRes = await fetch(`${BACKEND_URL}/auth/set-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin2@test.com',
        role: 'admin'
      })
    });
    const roleData = await roleRes.json();
    console.log('Full role response:', JSON.stringify(roleData, null, 2));
    console.log('✅', roleData.message);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }

  console.log('\n4️⃣ Testing sign-in with regular user...');
  try {
    const signinRes = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user2@test.com',
        password: 'password123'
      })
    });
    const signinData = await signinRes.json();
    console.log('Full signin response:', JSON.stringify(signinData, null, 2));
    console.log('✅ Regular user signed in');
    console.log('   Username:', signinData.user.username);
    console.log('   Role:', signinData.user.role);
  } catch (error) {
    console.error('❌ Error signing in regular user:', error.message);
  }

  console.log('\n5️⃣ Testing sign-in with admin user...');
  try {
    const signinRes = await fetch(`${BACKEND_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin2@test.com',
        password: 'password123'
      })
    });
    const signinData = await signinRes.json();
    console.log('Full admin signin response:', JSON.stringify(signinData, null, 2));
    console.log('✅ Admin user signed in');
    console.log('   Username:', signinData.user.username);
    console.log('   Role:', signinData.user.role);
  } catch (error) {
    console.error('❌ Error signing in admin user:', error.message);
  }

  console.log('\n✨ Testing complete!');
}

// Run tests
testRoles();
