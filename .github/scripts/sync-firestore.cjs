const fs = require('node:fs');
const path = require('node:path');
const admin = require('/tmp/nexus-firebase/node_modules/firebase-admin');
async function main() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw Error('GitHub Actions secret FIREBASE_SERVICE_ACCOUNT is not configured');
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
  const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(data.gameId || '')) throw Error('Invalid gameId');
  if (!/^https:\/\/github\.com\/kominnga\/nexus-store-games\/releases\/download\//.test(data.npgUrl || '')) throw Error('Invalid npgUrl');
  if (!/^[a-f0-9]{64}$/.test(data.fileHash || '')) throw Error('Invalid SHA256');
  const {gameId, ...fields} = data;
  fields.price = 0;
  fields.published = true;
  await admin.firestore().collection('games').doc(gameId).set(fields, {merge:true});
  console.log('Firestore game synchronized:', gameId);
}
main().catch(e => {console.error(e.message);process.exitCode=1});
