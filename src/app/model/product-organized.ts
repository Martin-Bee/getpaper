import { Product } from 'src/app/model/shopify/product';
import slugify from 'slugify';
/**
 * Organized Products Object
 */
export class OrganizedStacks {
  public currency: string;
  public id: string;
  public name: string;
  public email: string;
  public owner: string;
  public createdTime: Date;
  public description: string;
  public options: string[];
  public invites: string[];
  public totalQuantity: number;
  private stacksProductsDb: {};
  public stripeAccessToken: string;
  public stripeConnectKey: string;

  constructor(public products: Product[], public stacksProducts: Map<number, StacksProduct>) {
    this.createdTime = new Date();
  }

  /**
   * Create a stack copy
   * @param stack
   */
  static clone(stack: OrganizedStacks): OrganizedStacks {
    const copy = new OrganizedStacks([...stack.products], new Map());
    stack.stacksProducts.forEach((products, key) => {
      copy.stacksProducts.set(key, products);
    });
    copy.description = stack.description;
    if (stack.options) {
      copy.options = [...stack.options];
    }
    if (stack.invites) {
      copy.invites = [...stack.invites];
    }
    copy.totalQuantity = stack.totalQuantity;
    copy.currency = stack.currency;
    copy.name = stack.name;
    copy.owner = stack.owner;

    return copy;
  }

  /**
   * Options
   * @param options the list of options
   */
  setOptions(options: Set<string>): void {
    this.options = [];
    options.forEach(value => this.options.push(value));
  }

  /**
   * Convert our map to object
   */
  prepareForDB(name?: string): void {
    if (name) {
      this.name = name;
      this.id = slugify(name);
    }
    // convert stacks Products from a Map to an object
    if (this.stacksProducts) {
      this.stacksProducts.forEach(value => {
        // Reduce the variants map to a singular object
        value.variantsDb = [...value.variants].reduce((obj, [key, value]) => ((obj[key] = Array.from(value)), obj), {});
      });
      this.stacksProductsDb = [...this.stacksProducts.entries()].reduce((obj, [key, value]) => ((obj[key] = value), obj), {});
    }
  }

  /**
   * Convert our Object to map
   */
  static afterDB(stack: OrganizedStacks): void {
    if (stack) {
      stack.stacksProducts = new Map();
      for (const [key, value] of Object.entries(stack.stacksProductsDb)) {
        stack.stacksProducts.set(Number(key), value);
      }
      stack.stacksProducts.forEach(value => {
        value.variants = new Map();
        for (const [key1, value1] of Object.entries(value.variantsDb)) {
          value.variants.set(key1, new Set(value1 as string[]));
        }
        value.variantsDb = undefined;
      });
      stack.stacksProductsDb = undefined;
    }
  }

  static organizeToSell(stack: OrganizedStacks): void {
    if (!stack) {
      return;
    }
    // Sort products
    // descending order
    stack.products.sort((a: Product, b: Product) => {
      if (!stack.stacksProducts.get(a.id) || !stack.stacksProducts.get(b.id)) {
        return 0;
      }

      if (stack.stacksProducts.get(a.id).position < stack.stacksProducts.get(b.id).position) {
        return -1;
      } else {
        return 1;
      }
    });
    stack.totalQuantity = 0;

    //TODO improve this to include our own variants
    stack.products.forEach(p => {
      p.variants.forEach(variant => {
        // if (stack.options.includes(variant.title)) {
        stack.totalQuantity += variant.inventory_quantity;
        // }
      });
    });
  }
}

/**
 * This is our interface with the field that overrides shopify fields
 */
export interface StacksProduct {
  id?: number;
  position?: number;
  variants?: Map<string, Set<string>>;
  variantsDb?: {};
  quantitys?: Map<string, number[]>;
  quantitysDb?: {};
  price?: number;
  title?: string;
  warning?: boolean;
  message?: string;
}
