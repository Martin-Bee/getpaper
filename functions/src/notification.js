const admin = require('firebase-admin');

/**
 * Send a notification
 * @param {*} userUid the user id
 * @param {*} title the title of notification
 * @param {*} body the body of notification
 */
async function sendNotification(userUid, title, body) {
  const getDeviceTokensPromise = admin
    .database()
    .ref(`/notification_users/${userUid}/notificationTokens`)
    .once('value');

  // The snapshot to the user's tokens.
  // The array containing all the user's tokens.

  const results = await Promise.all([getDeviceTokensPromise]);
  const tokensSnapshot = results[0];

  // Check if there are any device tokens.
  if (!tokensSnapshot.hasChildren()) {
    return new Promise((resolve) => resolve());
  }
  console.log(
    'There are',
    tokensSnapshot.numChildren(),
    'tokens to send notifications to.'
  );

  // Notification details.
  const payload = {
    notification: {
      title,
      body,
      icon: 'assets/icon/notification.png',
    },
  };

  // Listing all tokens as an array.
  const tokens = Object.keys(tokensSnapshot.val());
  // Send notifications to all tokens.
  let response;
  try {
    response = await admin.messaging().sendToDevice(tokens, payload);
  } catch (err) {
    console.log(err);
  }
  // For each message check if there was an error.
  console.log(response);
  const tokensToRemove = [];
  response.results.forEach((result, index) => {
    const { error } = result;
    if (error) {
      console.error('Failure sending notification to', tokens[index], error);
      // Cleanup the tokens who are not registered anymore.
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
      }
    }
  });
  return Promise.all(tokensToRemove);
}

exports.sendNotification = sendNotification;
