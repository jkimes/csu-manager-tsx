import * as admin from 'firebase-admin';
import * as serviceAccount from '../../serviceKeys/clients-7be32-firebase-adminsdk-i5c0c-1cecf42b68.json'



// Initialize Firebase Admin SDK
admin.initializeApp({credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)});

// Function to set the admin claim
const setAdminClaim = async (uid: string) => {
  try {
    // Set the custom claim
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin claim set for user ${uid}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
  }
};

// Replace with the UID of the user you want to make an admin
const userId = 'ozuLyvFLcoZk4B4xbx14c78kNYB2'; // Replace with the actual UID
setAdminClaim(userId);