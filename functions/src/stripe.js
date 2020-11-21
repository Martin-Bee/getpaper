const stripe = require('stripe')(process.env.STRIPE_KEY);
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const querystring = require('querystring');

// Here is the sample for stripe and firebase:
// https://github.com/firebase/functions-samples/tree/master/stripe
// (functions.config().stripe.token);
// Set your secret key: remember to switch to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

function connect(req, res) {
  cors(req, res, () => {
    stripe.oauth
      .token({
        grant_type: 'authorization_code',
        code: req.body,
      })
      .then((response) => {
        res.status(200).send({ success: true, data: response });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({ success: false, err });
      });
  });
}

function authorizeStripe(req, res) {
  // Generate a random string as state to protect from CSRF and place it in the session.
  // req.session.state = Math.random().toString(36).slice(2);
  const uniqueKey = Math.random().toString(36).slice(2);
  // Prepare the mandatory Stripe parameters.
  let parameters = {
    client_id: functions.config().stripe.client_id,
    state: uniqueKey,
  };
  // Optionally, Stripe Connect accepts `first_name`, `last_name`, `email`,
  // and `phone` in the query parameters for them to be autofilled.
  parameters = Object.assign(parameters, {
    'stripe_user[business_type]': req.user.type || 'individual',
    'stripe_user[first_name]': req.user.firstName || undefined,
    'stripe_user[last_name]': req.user.lastName || undefined,
    'stripe_user[email]': req.user.email,
    'stripe_user[business_name]': req.user.businessName || undefined,
  });
  // Redirect to Stripe to start the Connect onboarding.
  res.redirect(
    `https://connect.stripe.com/express/oauth/authorize?${querystring.stringify(
      parameters
    )}`
  );
}

function stripeCharge(req, res) {
  // Handle Cors
  cors(req, res, () => {
    const token = req.body.token.token.id;
    const { amount, description, accessToken, currency } = req.body;
    stripe.charges
      .create(
        {
          amount, // amount in cents
          description,
          currency,
          source: token,
          application_fee: 1000, // amount in cents
        },
        accessToken
      )
      .then((charge) => {
        res.status(200).send({ success: true, data: charge });
        return console.log('CHARGE => ', charge);
      })
      .catch((err) => {
        res.status(400).send({ success: false, error: err });
        return console.log('Error => ', err);
      });
  });
}

exports.stripeCharge = stripeCharge;
exports.authorizeStripe = authorizeStripe;
exports.connect = connect;
