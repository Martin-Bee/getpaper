import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/model/shopify/product';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'brand-product-picker',
  templateUrl: './product-picker.component.html',
  styleUrls: ['./product-picker.component.scss']
})
export class ProductPickerComponent implements OnInit {
  @Input() products: Product[];
  @Output() setProducts: EventEmitter<Product[]> = new EventEmitter();
  collectionFilters: Set<string>;
  filteredProducts: Product[] = [];
  filters = new Map<string, boolean>();
  productDetails = new Map<number, boolean>();
  productQuantitys = new Map<number, number>();
  errorMessage: string;

  /**
   * Constructor
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Ng On Init
   */
  ngOnInit(): void {
    this.extractProductTypeFilters();
    this.extractProductQuantity();
    this.filteredProducts = [...this.products];
  }

  /**
   * Extracting collections filters
   * @param products
   */
  private extractProductTypeFilters(): void {
    const map: string[] = this.products.filter(p => p.product_type !== '').map(p => p.product_type);
    this.collectionFilters = new Set(map);
    this.filters = new Map<string, boolean>();
    // this.collectionFilters.forEach(v => this.filters.set(v, false));
  }

  /**
   * Extract Product quantitys
   */
  private extractProductQuantity(): void {
    this.productQuantitys.clear();
    this.products.forEach(p => {
      const total = p.variants.reduce((sum, current) => sum + Number(current.inventory_quantity), 0);
      this.productQuantitys.set(p.id, total);
    });
  }

  /**
   * When clicking on a filter UI applying proper filter
   * @param filter
   */
  applyFilters(filter: string): void {
    this.filters.set(filter, !this.filters.get(filter));
    this.filteredProducts = [];
    for (const f of this.filters) {
      if (f[1]) {
        this.filteredProducts.push(...this.products.filter(p => p.product_type === f[0]));
      }
    }
    if (this.filteredProducts.length === 0) {
      this.filteredProducts = [...this.products];
    }
  }

  /**
   * Resetting filters
   */
  resetFilters(): void {
    this.filters = new Map<string, boolean>();
    this.filteredProducts = [...this.products];
  }

  /**
   * Click on a product
   * @param product
   */
  showProductDetails(product: Product): void {
    if (this.productDetails) {
      this.productDetails.set(product.id, !this.productDetails.get(product.id));
    }
  }

  /**
   * Remove item from the list when clicking
   * @param product
   */
  remove(product: Product): void {
    this.filters.set('product-changed', true); // to activate the arrow in blue
    this.filteredProducts = this.filteredProducts.filter(item => item.id !== product.id);
  }

  /**
   * End event validating
   */
  validate(): void {
    if (this.filteredProducts.length > 0) {
      this.setProducts.emit(this.filteredProducts);
    } else {
      this.errorMessage = text.select_at_least_one_product;
      this.resetFilters();
    }
  }
}
