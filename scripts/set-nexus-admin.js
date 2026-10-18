
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

initializeApp({
  credential: cert(serviceAccount),
  projectId: "onrain-game"
});

async function main() {
  const uid = process.env.TARGET_UID;

  if (!uid) {
    throw new Error("管理者UIDが指定されていません");
  }

  const auth = getAuth();
  const user = await auth.getUser(uid);

  await auth.setCustomUserClaims(uid, {
    ...(user.customClaims || {}),
    nexusAdmin: true
  });

  console.log("NEXUS STORE 管理者登録成功！");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
