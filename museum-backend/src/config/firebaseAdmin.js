import admin from 'firebase-admin'
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' }
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
}

export default admin