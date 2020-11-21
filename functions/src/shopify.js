const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const request = require('request-promise');
const cookie = require('cookie');
const nonce = require('nonce')();
const crypto = require('crypto');
const querystring = require('querystring');
const notification = require('./notification.js');
// pick which env file to use based off the environment
// export NODE_ENV=production or export NODE_ENV=devlopment
let path = 'dev.env';
if (process.env.NODE_ENV === 'production') {
  console.log('Using prod.env');
  path = 'prod.env';
}
require('dotenv').config({ path });

const myShopifyDomain = '.myshopify.com';
const shopifyApiVersion = '2020-01';

// Initialization shopify App
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products, read_inventory';
const forwardingAddress = process.env.FORWARD_ADDRESS;

// Path db name
const shopifyConfIndexPath = 'shopify_conf_index';
const shopifyConfPath = 'shopify_conf';
const shopifyProductPath = 'shopify_products';
const shopifyStorePath = 'shopify_stores';

/**
 * Get Shopify data
 * @param {*} req
 * @param {*} res
 * @param {*} frag
 */
function getShopifyData(req, res, frag) {
  return cors(req, res, () => {
    const shopRequestUrl = `https://${req.body.shop}${myShopifyDomain}/admin/api/${shopifyApiVersion}/${frag}`;
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': req.body.token,
    };

    request
      .get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((shopResponse) => res.status(200).send(shopResponse))
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
  });
}

/**
 * Get Inventory Data
 */
function getInventoryData(shop, ids) {
  return new Promise((resolve, reject) => {
    const shopRequestUrl = `https://${shop.id}${myShopifyDomain}/admin/api/${shopifyApiVersion}/inventory_levels.json?inventory_item_ids=${ids}`;
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': shop.token,
    };

    request
      .get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((shopResponse) => {
        console.log(shopResponse);
        resolve(shopResponse);
      })
      .catch((error) => {
        console.log(error);
        reject(error.error.error_description);
      });
  });
}

/**
 * Import shopify products
 * @param {*} userId
 * @param {*} shopifyStore
 * @param {*} token
 */
async function importShopifyProducts(userId, shopifyStore, token) {
  console.log(`importing shopify producrs for: ${userId}, ${shopifyStore}`);
  const productRequestUrl = `https://${shopifyStore}${myShopifyDomain}/admin/api/${shopifyApiVersion}/products.json`;
  const shopRequestUrl = `https://${shopifyStore}${myShopifyDomain}/admin/api/${shopifyApiVersion}/shop.json`;
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': token,
  };
  const refProduct = admin
    .database()
    .ref(shopifyProductPath)
    .child(userId)
    .child(shopifyStore);

  const refStore = admin
    .database()
    .ref(shopifyStorePath)
    .child(userId)
    .child(shopifyStore);

  const refStatus = admin
    .database()
    .ref(shopifyConfPath)
    .child(userId)
    .child(shopifyStore);

  try {
    const productResponse = await request.get(productRequestUrl, {
      headers: shopRequestHeaders,
      json: true,
    });
    const shopResponse = await request.get(shopRequestUrl, {
      headers: shopRequestHeaders,
      json: true,
    });
    console.log('request dones ...');
    console.log('setting shop response ...');
    await refStore.set(shopResponse);
    await refProduct.set({ products: productResponse.products });
    await refStatus.update({ lastUpdated: Date.now(), status: 'done' });
  } catch (error) {
    refStatus.update({ lastUpdated: Date.now(), status: 'error' });
    console.log(error);
  }
  console.log('sending notifications ...');
  try {
    await notification.sendNotification(
      userId,
      'Shopify product successfull',
      'Your shopify products have been successfully imported!'
    );
  } catch (error) {
    console.log('Failed to send notifications');
  }
}

/**
 * Redirect user to the shop to install app with a 3rd party cookie
 * @param {*} req
 * @param {*} res
 */
function shopifyApp(req, res) {
  const { shop } = req.query;
  if (shop) {
    const state = nonce();
    const redirectUri = `${forwardingAddress}/shopifyCallback`;
    const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    res
      .status(400)
      .send(
        'Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request'
      );
  }
}

/**
 * Callback after installing the app on Shopify to get the shopify token
 * @param {*} req
 * @param {*} res
 */
async function callback(req, res) {
  // add state for the cookie.
  const { shop, hmac, code, state } = req.query;
  // const { shop, hmac, code } = req.query;
  console.log(`cookie:  ${req.headers.cookie}`);
  // console.log('cookie');
  if (process.env.NODE_ENV === 'production') {
    console.log('Checking cookie is valid?');
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  }

  if (shop && hmac && code) {
    // DONE: Validate request is from Shopify
    const map = { ...req.query };
    delete map.signature;
    delete map.hmac;
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto.createHmac('sha256', apiSecret).update(message).digest('hex'),
      'utf-8'
    );
    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }
    if (!hashEquals) {
      return res.status(400).send('HMAC validation failed');
    }
    // DONE: Exchange temporary code for a permanent access token
    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };
    try {
      const accessTokenResponse = await request.post(accessTokenRequestUrl, {
        json: accessTokenPayload,
      });
      const accessToken = accessTokenResponse.access_token;
      console.log('got access token');
      // look into firebase see if the domain is there:
      const subShop = shop.replace(myShopifyDomain, '');
      const ref = admin.database().ref(shopifyConfIndexPath).child(subShop);
      const user = await ref.once('value');
      if (!user && !user.val()) {
        res
          .status(400)
          .send(
            '<h3 style="color:red">Please try again we didnt understand that</h3>'
          );
      }

      // Set the loading into the shopify products
      await admin
        .database()
        .ref(shopifyConfPath)
        .child(user.val())
        .child(subShop)
        .update({
          token: accessToken,
          status: 'loading',
          lastUpdated: Date.now(),
        });
      res
        .status(200)
        .send(
          '<h3 style="color:green">The App was succesfully installed, you can now close this tab!</h3>'
        );
    } catch (error) {
      console.log(error);
      res.status(error.statusCode).send(error.error_description);
    }
  } else {
    res.status(400).send('Required parameters missing');
  }
}

exports.getShopifyData = getShopifyData;
exports.importShopifyProducts = importShopifyProducts;
exports.shopifyApp = shopifyApp;
exports.callback = callback;
exports.getInventoryData = getInventoryData;
