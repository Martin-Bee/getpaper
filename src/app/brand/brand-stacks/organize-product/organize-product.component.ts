import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/model/shopify/product';
import { AlertController } from '@ionic/angular';
import { OrganizedStacks, StacksProduct } from 'src/app/model/product-organized';
import { parseVariantOptions, extractPrice } from 'src/app/utils/shopify-utils';
import * as text from 'src/app/resources/resource.json';
import { allCurrencies } from 'src/app/utils/currencies';

@Component({
  selector: 'brand-organize-product',
  templateUrl: './organize-product.component.html',
  styleUrls: ['./organize-product.component.scss']
})
export class OrganizeProductComponent implements OnInit {
  private static readonly TITLE_ASTERIX = 'title__custom';
  private static readonly PRICE_ASTERIX = 'price__custom';
  private static readonly OPTION_ASTERIX = 'option__custom';
  private static readonly PERCENT_ASTERIX = 'percent__custom';

  @Input() products: Product[];
  @Input() currencies: Set<string>;
  @Output() setOrganizedProducts = new EventEmitter<OrganizedStacks>();
  edits = new Map<number, StacksProduct>();
  variantsName: Set<string>;
  currency: string;
  hasError = false;
  pricingPercent = 60;

  constructor(private alertCtrl: AlertController) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.initEdits();
    if (this.currencies.size > 0) {
      this.currency = this.currencies.values().next().value;
    }
    if (this.currencies.size > 1) {
      this.currencyChoice(false);
    }
  }

  /**
   * Change the currency
   */
  changeCurrency(): void {
    this.currencyChoice(true);
  }

  /**
   * List the options
   */
  variantsOptions(): string {
    const s = [...this.variantsName].reduce((a, b) => `${a}, ${b}`, '');
    if (s && s.startsWith(',')) {
      return s.substr(1, s.length);
    }
    return s;
  }

  /**
   * Add an option to our list
   */
  async addOption(): Promise<void> {
    await this.variantSuggestion(null, OrganizeProductComponent.OPTION_ASTERIX);
  }

  async changePricing(): Promise<void> {
    await this.variantSuggestion(null, OrganizeProductComponent.PERCENT_ASTERIX);
  }

  /**
   * Change Variants
   */
  async changeVariants(): Promise<void> {
    const inputs = [];
    this.variantsName.forEach(option => {
      inputs.push({
        name: option,
        type: 'checkbox',
        label: option,
        value: option,
        checked: true
      });
    });
    const alert = await this.alertCtrl.create({
      header: text.choose_option_for_order_form,
      inputs,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (): void => {}
        },
        {
          text: text.ok,
          handler: (data): void => {
            this.variantsName = new Set();
            data.forEach(element => {
              this.variantsName.add(element);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Display dialog to ask which currency to pick
   */
  private async currencyChoice(all: boolean): Promise<void> {
    const inputs = [];
    let i = 0;
    if (!all) {
      this.currencies.forEach(curr => {
        inputs.push({
          name: `radio${curr}`,
          type: 'radio',
          label: `${curr}`,
          value: `${curr}`,
          checked: i === 0
        });
        i++;
      });
    } else {
      allCurrencies.forEach(curr => {
        inputs.push({
          name: `radio${curr.symbol}`,
          type: 'radio',
          label: `${curr.label}`,
          value: `${curr.symbol}`,
          checked: i === 0
        });
        i++;
      });
    }
    const alert = await this.alertCtrl.create({
      header: text.currency_picker_header,
      subHeader: text.currency_picker_subheader,
      cssClass: 'currency-popup',
      inputs,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary'
          // handler: (): void => {}
        },
        {
          text: text.ok,
          handler: (data): void => {
            this.currency = data;
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * update Prices
   */
  private updatePrices(): void {
    const prices = extractPrice(this.products);
    this.edits.forEach((value, key) => {
      const price = (prices.get(key) * this.pricingPercent) / 100;
      value.price = Number(price.toFixed(2));
    });
  }

  private initEdits(): void {
    let map: Map<number, Map<string, Set<string>>>;
    [this.variantsName, map] = parseVariantOptions(this.products);
    const prices = extractPrice(this.products);
    // Initialize our edits hash
    map.forEach((value, key) => {
      const price = (prices.get(key) * this.pricingPercent) / 100;
      this.edits.set(key, { variants: value, price: Number(price.toFixed(2)), id: key });
    });
  }

  /**
   * Reordoring Items as user wishes
   * @param event
   */
  reorderItems(event): void {
    const itemToMove = this.products.splice(event.detail.from, 1)[0];
    this.products.splice(event.detail.to, 0, itemToMove);
    event.detail.complete();
  }

  /**
   * Color/Size and other variant but also title suggestion
   * @param product
   */
  async variantSuggestion(product: Product, variantName: string): Promise<void> {
    let productId = -1;
    if (product) {
      productId = product.id;
    }
    const variantTitle = variantName
      .replace(OrganizeProductComponent.TITLE_ASTERIX, 'title')
      .replace(OrganizeProductComponent.PRICE_ASTERIX, 'price')
      .replace(OrganizeProductComponent.OPTION_ASTERIX, 'option')
      .replace(OrganizeProductComponent.PERCENT_ASTERIX, 'new % to apply to prices');
    const promptColor = await this.alertCtrl.create({
      header: `Suggest ${variantTitle}`,
      inputs: [
        {
          name: `${variantName}-${productId}`,
          placeholder: `Enter your ${variantTitle}`,
          value: variantName.includes(OrganizeProductComponent.TITLE_ASTERIX)
            ? `${product.title}`
            : variantName.includes(OrganizeProductComponent.PRICE_ASTERIX)
            ? `${this.edits.get(productId).price}`
            : ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: this.setVariantSuggestion
        }
      ]
    });
    await promptColor.present();
  }

  /**
   * Callback when the prompt is done
   */
  setVariantSuggestion = (data: { [key: string]: string }): void => {
    Object.keys(data).forEach(key => {
      const [variantName, id] = key.split('-');
      // The user is updating the name
      if (key.includes(OrganizeProductComponent.TITLE_ASTERIX)) {
        this.edits.get(parseInt(id)).title = data[key];
      } else if (key.includes(OrganizeProductComponent.PRICE_ASTERIX)) {
        this.edits.get(parseInt(id)).price = parseFloat(data[key]);
      } else if (key.includes(OrganizeProductComponent.OPTION_ASTERIX)) {
        this.variantsName.add(data[key]);
      } else if (key.includes(OrganizeProductComponent.PERCENT_ASTERIX)) {
        const maybeNumber = Number(data[key]);
        if (isNaN(maybeNumber)) {
          // TODO display alert message.
        } else {
          this.pricingPercent = maybeNumber;
          this.updatePrices();
        }
      } else {
        // Variants set is not defined
        if (!this.edits.get(parseInt(id)).variants.get(variantName)) {
          this.edits.get(parseInt(id)).variants.set(variantName, new Set());
        }
        this.edits
          .get(parseInt(id))
          .variants.get(variantName)
          .add(`${data[key]}--custom`);
      }
    });
  };

  /**
   * Remove the variant selected
   * @param event
   * @param product
   * @param variantName
   * @param variantOption
   */
  removeVariant(event, product: Product, variantName: string, variantOption: string): void {
    // const btnEle = event.target;
    this.edits
      .get(product.id)
      .variants.get(variantName)
      .delete(variantOption);
  }

  /**
   * Check and color lines with warning
   */
  private checkVariantsDefined(): boolean {
    let hasWarning = false;
    this.edits.forEach(value => (value.warning = false));
    for (const product of this.products) {
      for (const name of this.variantsName) {
        if (this.edits.get(product.id).variants.get(name) && this.edits.get(product.id).variants.get(name).size === 0) {
          this.edits.get(product.id).warning = true; // Set the warning for this specific line-item
          hasWarning = true;
        }
        if (!this.edits.get(product.id).variants.get(name)) {
          this.edits.get(product.id).warning = true; // Set the warning for this specific line-item
          hasWarning = true;
        }
      }
    }
    return hasWarning;
  }

  /**
   * Complete the component
   */
  complete(): void {
    this.hasError = false;
    if (!this.checkVariantsDefined()) {
      this.setProductPosition();
      const o = new OrganizedStacks(this.products, this.edits);
      o.currency = this.currency;
      o.setOptions(this.variantsName);

      // Emit the new Organized stacks
      this.setOrganizedProducts.emit(o);
    } else {
      this.hasError = true;
    }
  }

  /**
   *
   */
  private setProductPosition(): void {
    this.products.forEach((p, index) => (this.edits.get(p.id).position = index));
  }
}
