import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrganizedStacks } from 'src/app/model/product-organized';

@Component({
  selector: 'brand-finalize-product',
  templateUrl: './finalize-product.component.html',
  styleUrls: ['./finalize-product.component.scss']
})
export class FinalizeProductComponent implements OnInit {
  @Input() review: OrganizedStacks;
  @Output() setFinalizedProducts = new EventEmitter<OrganizedStacks>();
  loopAroundVariant: string;
  otherVariants: Set<string>;

  /**
   * DEfault Constructor
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  ngOnInit(): void {
    // this.decideVariantToLoopAround();
  }

  /**
   * Save button click
   */
  save(): void {
    this.setFinalizedProducts.emit(this.review);
  }

  /**
   * Edit goes back to as before
   */
  edit(): void {
    this.setFinalizedProducts.emit(null);
  }

  /**
   * Decide which variant to loop around

  private decideVariantToLoopAround(): void {
    const variantsName = this.review.options;

    // Try to compare and see if you can detect size or color which are the most common variants
    variantsName.forEach(variantName => {
      const name = variantName.toLowerCase();
      if (name.includes('colo')) {
        this.loopAroundVariant = variantName;
      } else if (name.includes('size') || name.includes('taille')) {
      } else {
        this.loopAroundVariant = variantName;
      }
    });
    // this.otherVariants = new Set<string>(variantsName);
    // this.otherVariants.delete(this.loopAroundVariant);
  }*/
}
