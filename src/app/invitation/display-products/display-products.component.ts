import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { OrganizedStacks } from 'src/app/model/product-organized';
import Fuse from 'fuse.js';
import '@vaadin/vaadin-text-field/vaadin-integer-field.js';
import { OrderOverview } from 'src/app/model/order-overview.model';
import { ProductDetailsComponent } from 'src/app/invitation/product-details/product-details.component';
import { Product } from 'src/app/model/shopify/product';

@Component({
  selector: 'display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.scss'],
})
export class DisplayProductsComponent implements OnInit, OnChanges {
  @Input() stackOriginal: OrganizedStacks;
  @Input() search: string;
  @Input() showOverlay: boolean;
  @Output() setOverview: EventEmitter<OrderOverview> = new EventEmitter();
  @Output() goNext: EventEmitter<void> = new EventEmitter();

  stack: OrganizedStacks;
  loopAroundVariant: string;
  otherVariants: Set<string>;
  quantitys: Map<string, number>;
  quantitysPerProduct: Map<string, number>;
  totalPerProduct: Map<string, number>;
  quantitysAvailable: Map<string, number>;
  ratings: Map<string, number>;
  previewMode: boolean;

  constructor(public plt: Platform, private modalController: ModalController) {}

  ngOnInit(): void {
    this.stack = this.stackOriginal;
    this.previewMode = false;
    if (!this.stack.stripeAccessToken || !this.stack.stripeConnectKey) {
      this.previewMode = true;
    }
    this.decideVariantToLoopAround();
    this.fillQuantitysAvailable();
  }

  removeOverlay(): void {
    this.showOverlay = false;
    this.updateTotals();
  }

  next(): void {
    this.goNext.emit();
  }

  /**
   * Fill Quantitys
   */
  private fillQuantitysAvailable(): void {
    this.quantitys = new Map();
    this.ratings = new Map();
    this.quantitysAvailable = new Map();
    this.totalPerProduct = new Map();
    this.quantitysPerProduct = new Map();
    this.stackOriginal.products.forEach((product) => {
      product.variants.forEach((variant) => {
        const key = product.id + '-' + variant.option1 + '-' + variant.option2;
        const key1 = product.id + '-' + variant.option2 + '-' + variant.option1;
        // TODO add more variant options
        this.quantitys.set(key, 0);
        this.quantitys.set(key1, 0);
        const quantity = variant.inventory_quantity; //Math.floor(Math.random() * 10);
        this.quantitysAvailable.set(key, quantity); // variant.inventory_quantity
        this.quantitysAvailable.set(key1, quantity); // variant.inventory_quantity
      });
    });
  }

  /**
   * Decide which variant to loop around
   */
  private decideVariantToLoopAround(): void {
    if (!this.stack) {
      return;
    }

    const variantsName = this.stack.options;
    // Try to compare and see if you can detect size or color which are the most common variants
    variantsName.forEach((variantName) => {
      const name = variantName.toLowerCase();
      if (name.includes('colo')) {
        this.loopAroundVariant = variantName;
      } else if (name.includes('size') || name.includes('taille')) {
      } else {
        this.loopAroundVariant = variantName;
      }
    });
    this.otherVariants = new Set<string>(variantsName);
    this.otherVariants.delete(this.loopAroundVariant);
  }

  /**
   * Rating event
   * @param event
   */
  handleRatingClick(productId: number, variantOption: string, event): void {
    this.ratings.set(this.key(productId, variantOption), Number(event));
    this.updateTotals();
  }

  /**
   * Build key
   */
  key = (productId: number, variantOption1: string, variantOption2?: string): string => {
    if (!variantOption2) {
      return `${productId}-${variantOption1}`;
    }
    return `${productId}-${variantOption1}-${variantOption2}`;
  };

  /**
   * Update all totals
   */
  private updateTotals(): void {
    const totalUnits = [...this.quantitys.values()].reduce((a, b) => a + b, 0);
    const totalSpend = [...this.totalPerProduct.values()].reduce((a, b) => a + b, 0);
    const rating = [...this.ratings.values()].reduce((previous, current) => (current += previous), 0) / this.ratings.size;
    this.setOverview.emit({
      totalUnits,
      totalSpend,
      currency: this.stackOriginal.currency,
      rating,
      showOverlay: this.showOverlay,
      quantitys: this.quantitys,
      stackName: this.stackOriginal.name,
      showButton: !this.previewMode,
    });
  }

  /**
   * Set Quantity to the model
   * @param productId
   * @param variantOption1
   * @param variantOption2
   * @param event
   */
  setQuantity(productId: number, variantOption1: string, variantOption2: string, event): void {
    this.quantitys.set(this.key(productId, variantOption1, variantOption2), Number(event.target.value));
    this.updateLineTotals(productId, variantOption1);
    this.updateTotals();
  }

  /**
   * Update line total
   * @param productId
   * @param variantOption1
   */
  private updateLineTotals(productId: number, variantOption1: string): void {
    let total = 0;
    this.quantitys.forEach((value, key) => {
      if (key.includes(this.key(productId, variantOption1))) {
        if (this.quantitys.get(key)) {
          total += this.quantitys.get(key);
        }
      }
    });
    this.quantitysPerProduct.set(this.key(productId, variantOption1), total);
    this.totalPerProduct.set(this.key(productId, variantOption1), total * this.stackOriginal.stacksProducts.get(productId).price);
  }

  /**
   * Add +1 to all sizes
   * @param productId
   * @param variantOption1
   */
  sizeRunAdd(productId: number, variantOption1: string): void {
    this.quantitys.forEach((value, key) => {
      const newQuantity = value + 1;
      if (key.includes(this.key(productId, variantOption1))) {
        if (this.quantitysAvailable.get(key) && this.quantitysAvailable.get(key) >= newQuantity) {
          this.quantitys.set(key, newQuantity);
        }
      }
    });
    this.updateLineTotals(productId, variantOption1);
    this.updateTotals();
  }

  /**
   * Add -1 to All sizes
   * @param productId
   * @param variantOption1
   */
  sizeRunRemove(productId: number, variantOption1: string): void {
    this.quantitys.forEach((value, key) => {
      const newQuantity = value - 1;
      if (key.includes(this.key(productId, variantOption1))) {
        if (newQuantity < 0) {
          return;
        }
        if (this.quantitysAvailable.get(key) && this.quantitysAvailable.get(key) >= newQuantity) {
          this.quantitys.set(key, newQuantity);
        }
      }
    });
    this.updateTotals();
  }

  /**
   * on Changes
   * @param changes
   */
  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (const propName in changes) {
      if (propName === 'search') {
        const changedProp = changes[propName];
        if (changedProp && !changedProp.isFirstChange()) {
          this.performSearch(changedProp.currentValue);
        }
      }
    }
  }

  /**
   * Show Product Details
   * @param product
   */
  async showProductDetails(product: Product): Promise<void> {
    const modal = await this.modalController.create({
      component: ProductDetailsComponent,
      componentProps: {
        images: product.images.map((value) => value.src),
        description: product.body_html,
      },
      showBackdrop: true,
    });
    return await modal.present();
  }

  /**
   * Perform the search in products
   * @param search
   */
  private performSearch(search: string): void {
    if (!search || search === '') {
      this.stack = this.stackOriginal;
      return;
    }

    this.stack = OrganizedStacks.clone(this.stackOriginal);
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['title', 'description'],
    };
    const fuse = new Fuse(this.stackOriginal.products, options);
    this.stack.products = fuse.search(search).map((value) => value.item);

    const fuse1 = new Fuse(Array.from(this.stackOriginal.stacksProducts.values()), options);

    let array = fuse1.search(search).map((value) => {
      if (value.item.id) {
        for (const p of this.stackOriginal.products) {
          if (p.id === value.item.id) {
            return p;
          }
        }
      }
    });
    array = array.filter((el) => {
      return el != null;
    });
    this.stack.products.push(...array);
  }
}
