
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "onrain-game"
});

async function main() {
  const uid = process.env.TARGET_UID;

  if (!uid) {
    throw new Error("管理者UIDが指定されていません");
  }

  const user = await admin.auth().getUser(uid);

  const claims = {
    ...(user.customClaims || {}),
    nexusAdmin: true
  };

  await admin.auth().setCustomUserClaims(uid, claims);

  console.log("NEXUS STOREの管理者登録が完了しました");
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
