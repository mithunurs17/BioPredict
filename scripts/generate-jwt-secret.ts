import crypto from 'crypto';

// Generate a random 64-byte hex string
const secret = crypto.randomBytes(64).toString('hex');
console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nAdd this to your .env file as:');
console.log('JWT_SECRET=' + secret); 