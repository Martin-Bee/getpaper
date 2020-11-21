const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const email = require('./src/mail.js');
const stripe = require('./src/stripe.js');
const shopify = require('./src/shopify.js');
const notification = require('./src/notification.js');
const inventory = require('./src/inventory');

// Initialize admin SDK
// Admin SDK is required to update the token returned by shopify
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: '',
});

/**
 * Send Verification Code using NodeMailer
 */
exports.sendVerificationCode = functions.https.onRequest((req, res) => {
  const options = {
    subject: 'GetPaper Verification Code',
    filename: 'verification-code',
    to: req.body.email,
    verificationCode: req.body.code,
    emailTitle: 'Confirm your email with the following code',
  };

  email.sendEmail(req, res, options);
});

/**
 * sendWelcomeEmail
 * request.body can contains Name, Company
 * request.body must contains the email
 */
exports.sendWelcomeEmail = functions.https.onRequest((req, res) => {
  if (req && res) {
    return cors(req, res, () => {
      const options = {
        subject: 'Welcome to GetPaper ',
        filename: 'welcome',
        to: req.body.email,
        emailTitle: 'Welcome to GetPaper.io',
      };
      email.sendEmail(req, res, options);
    });
  }
});

/**
 * send Order Confirmation Email
 */
exports.sendOrderConfirmationEmail = functions.https.onRequest((req, res) => {
  if (req && res) {
    return cors(req, res, () => {
      const options = {
        subject: `We got your order: #${req.body.overview.orderId}`,
        filename: 'order-confirmation',
        to: req.body.email,
        emailTitle: 'Order Confirmation',
        overview: req.body.overview,
      };
      email.sendEmail(req, res, options);
    });
  }
});

/**
 * Send invitation e-mail to users selected after creating the products stack
 */
exports.sendInvitation = functions.https.onRequest((req, res) => {
  if (req && res) {
    return cors(req, res, () => {
      const { companyName, stackName, receivers } = req.body;
      for (const to of receivers) {
        const inviteURL = `https://invitation?name=${stackName}&email=${to}`;
        const options = {
          subject: 'GetPaper Invitation',
          filename: 'invitation',
          to,
          inviteURL,
          companyName,
          stackName,
          emailTitle: `Announcing <a href="${inviteURL}" class="collection-name">${stackName} Collection</a> by ${companyName}`,
        };

        email.sendEmail(req, res, options);
      }
    });
  }
});

/**
 * Authorize Stripe
 */
exports.authorize = functions.https.onRequest((req, res) => {
  stripe.authorizeStripe(req, res);
});

/**
 * Create Stripe Charge
 */
exports.stripeCharge = functions.https.onRequest((req, res) => {
  stripe.stripeCharge(req, res);
});

exports.stripeConnect = functions.https.onRequest((req, res) => {
  stripe.connect(req, res);
});

/**
 * Get Shopify Shop information
 */
exports.getShopifyStoreInfo = functions.https.onRequest((req, res) => {
  console.log('Get Shopify Store informations!');
  const frag = 'shop.json';
  return shopify.getShopifyData(req, res, frag);
});

/**
 * Get Shopify Products
 */
exports.getShopifyProducts = functions.https.onRequest((req, res) => {
  const frag = 'products.json';
  return shopify.getShopifyData(req, res, frag);
});

/**
 * Get Shopify Products
 */
exports.getShopifyInventoryLevel = functions.https.onRequest((req, res) => {
  const frag = 'inventory_levels.json';
  return shopify.getShopifyData(req, res, frag);
});

/**
 * Shopify install path
 */
exports.shopify = functions.https.onRequest((req, res) => {
  shopify.shopifyApp(req, res);
});

/**
 * Shopify Callback function once the app install has been confirmed
 */
exports.shopifyCallback = functions.https.onRequest(async (req, res) => {
  shopify.callback(req, res);
});

/**
 * Test notification
 */
exports.testNotification = functions.https.onRequest((req, res) =>
  cors(req, res, async () => {
    await notification.sendNotification(
      '',
      'You have a new follower!',
      `Martin is now following you.`
    );
    res.json('{}');
  })
);

/**
 * Test Shopify import Product with some specific data
 */
exports.testShopifyProduct = functions.https.onRequest((req, res) =>
  cors(req, res, async () => {
    shopify.importShopifyProducts(
      '',
      'mydevstore-xxyy-01',
      ''
    );
    res.json('{}');
  })
);

/**
 * Import Shopify Products
 */
exports.importShopifyProducts = functions.database
  .ref('/shopify_conf/{userUid}/{shopifyStore}/token')
  .onUpdate(async (change, context) => {
    const after = change.after.val();
    if (after && after !== 'not_set') {
      console.log('import ...');
      await shopify.importShopifyProducts(
        context.params.userUid,
        context.params.shopifyStore,
        after
      );
    }
  });

/**
 * Shopify notification install
 */
exports.sendShopifyInstallNotification = functions.database
  .ref('/shopify_conf/{userUid}/{shopifyStore}/token')
  .onUpdate(async (change, context) => {
    // Only edit data when it is first created.
    // if (change.before.exists()) {
    const after = change.after.val();
    // const before = change.before.val();
    if (after && after !== 'not_set') {
      console.log(`sending notification.. `);
      await notification.sendNotification(
        context.params.userUid,
        `Shopify App Install successful!`,
        `The application has been successfully installed on ${context.params.shopifyStore}! We are importing your products.`
      );
      return null;
    }
  });

// exports.updateQuantyOnHand = functions.pubsub
//   .schedule('every 12 hours')
//   .onRun(() => {
//     inventory.syncInventories();
//   });

// inventory.syncInventories();
