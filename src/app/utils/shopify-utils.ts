import { Product } from 'src/app/model/shopify/product';
import { ShopInfo } from 'src/app/model/shopify/info';

/**
 * Extract currencies from the list of currencties
 * @param shops
 */
export function extractCurrencies(shops: ShopInfo[]): Set<string> {
  const currencies = new Set<string>();
  shops.forEach(shop => {
    if (shop.currency) {
      currencies.add(shop.currency);
    }
  });
  return currencies;
}

/**
 * Todo Improve this function
 * @param products
 */
export function extractPrice(products: Product[]): Map<number, number> {
  const prices = new Map<number, number>();
  for (const product of products) {
    for (const variant of product.variants) {
      const price = Number(Number(variant.price).toFixed(2));
      prices.set(product.id, price);
    }
  }

  return prices;
}

/**
 * Parse Variant to figure out where is the options
 * Set: unique variants title
 * Map: Product id, variantstitle, set of variants values
 */
export function parseVariantOptions(products: Product[]): [Set<string>, Map<number, Map<string, Set<string>>>] {
  const variantsName = new Set<string>();
  const productsVariants = new Map<number, Map<string, Set<string>>>();

  // Define the list of variants name found in products
  for (const product of products) {
    const values = new Map<string, Set<string>>();
    const productVariant = [];
    product.options.forEach(option => {
      variantsName.add(option.name); // global list of all variants present
      productVariant.push(option.name); // local only for this product
    });

    for (const variant of product.variants) {
      let index = 1;
      for (const name of productVariant) {
        const variantValue = variant[`option${index}`];
        if (variantValue) {
          if (values.get(name)) {
            values.get(name).add(variantValue);
          } else {
            const set = new Set<string>();
            set.add(variantValue);
            values.set(name, set);
          }
        }
        index++;
      }
    }

    productsVariants.set(product.id, values);
  }
  return [variantsName, productsVariants];
}
