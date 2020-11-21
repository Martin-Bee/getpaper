const admin = require('firebase-admin');
const shopify = require('./shopify');

/**
 * Update the inventory for a specific store
 * @param {*} store
 */
async function updateInventory(store, items) {
  console.log(`updating products quantities for: ${store.id}`);
  const mapped = items.map((value) => value.inventoryId).join(',');
  try {
    const response = await shopify.getInventoryData(store, mapped);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

function buildDictionary(products, path) {
  const keys = Object.keys(products);
  const dict = [];
  for (const key of keys) {
    const productPath = `${path}/${key}`;
    const variantKeys = Object.keys(products[key].variants);
    for (const variantKey of variantKeys) {
      dict.push({
        path: `${productPath}/${variantKey}`,
        inventoryId: products[key].variants[variantKey].inventory_item_id,
      });
    }
  }
  return dict;
}

/**
 * Sync all shopify inventories store
 */
async function syncInventories() {
  console.log('sync inventories');
  const storesPromise = admin.database().ref(`/shopify_conf`).once('value');
  const productsPromise = admin
    .database()
    .ref(`/shopify_products`)
    .once('value');
  const results = await Promise.all([storesPromise, productsPromise]);

  const allStores = results[0].val();
  const allProducts = results[1].val();
  const allKeys = Object.keys(allStores);

  // Browse all the users
  for (const allKey of allKeys) {
    const keys = Object.keys(allStores[allKey]);
    for (const key of keys) {
      const store = allStores[allKey][key];
      if (
        store.token &&
        store.status &&
        store.token !== 'not_set' &&
        store.status === 'done' &&
        store.id === 'humm'
      ) {
        const dict = buildDictionary(
          allProducts[allKey][key].products,
          `${allKey}/${key}/products`
        );
        updateInventory(store, dict);
      }
    }
  }
}

exports.syncInventories = syncInventories;
