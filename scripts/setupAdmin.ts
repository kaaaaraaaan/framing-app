import './loadEnv.js';
import { setupAdmin } from '../src/utils/adminSetup.js';

// Load environment variables
// config();

// Replace these values with your desired admin credentials
const adminEmail = 'admin@framecraft.com';
const adminPassword = 'Amdrx@550';
const adminFirstName = 'Admin';
const adminLastName = 'User';

async function run() {
  try {
    await setupAdmin(adminEmail, adminPassword, adminFirstName, adminLastName);
    console.log('Admin setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Admin setup failed:', error);
    process.exit(1);
  }
}

run();
