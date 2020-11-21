import { Component, OnInit } from '@angular/core';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StacksService } from 'src/app/providers/stacks/stacks.service';
import { UserService, UserEvent } from 'src/app/providers/user/user.service';
import { ShopifyService } from 'src/app/providers/shopify/shopify.service';
import { Product } from 'src/app/model/shopify/product';
import { OrganizedStacks } from 'src/app/model/product-organized';
import { extractCurrencies } from 'src/app/utils/shopify-utils';
import { Subscription, interval } from 'rxjs';
import * as text from 'src/app/resources/resource.json';
import { buildShareLink } from 'src/app/utils/share-invitation-link';

interface Step {
  stepNumber: number;
  title: string;
  subtitle: string;
  fn?: () => Promise<boolean>;
}

@Component({
  selector: 'app-brand-stacks',
  templateUrl: './brand-stacks.page.html',
  styleUrls: ['./brand-stacks.page.scss'],
})
export class BrandStacksPage implements OnInit {
  /**
   * get Products
   */
  getProducts = async (): Promise<boolean> => {
    this.errorMessage = '';
    this.loadingText = 'Loading products ...';
    if (this.shopifyService.hasUser) {
      const products = await this.shopifyService.getShopifyProducts();
      const stores = await this.shopifyService.getStoreInfos();
      if (products) {
        this.products = products[0].products;
        if (this.products.length === 0 && products[1].length) {
          this.errorMessage = `We are still loading your products for: ${products[1].join()}, please wait couple of minutes. `;
          this.retryLoadingProducts();
        }
        if (products[2].length) {
          this.errorMessage = `${this.errorMessage ? this.errorMessage : ''}Some store were not configured properly: ${products[2].join()}.
          You can go to <a href="/account-info">settings</a> to fix this.`;
        }
      }

      if (this.errorMessage) {
        return false;
      }
      if (products[1].length) {
        this.errorMessage = `We are still loading your products for: ${products[1].join()}, please wait couple of minutes. `;
      }
      if (stores) {
        this.currencies = extractCurrencies(stores);
      }
    }
    this.loadingText = '';
    return true;
  };

  /**
   * Reset Error before next step
   */
  resetError = async (): Promise<boolean> => {
    this.errorMessage = '';
    return true;
  };

  /**
   * Save Stack
   */
  saveStack = async (): Promise<boolean> => {
    this.organizedProducts.email = this.userService.get('email');
    this.organizedProducts.prepareForDB(this.stackName);
    this.shareLink = buildShareLink(this.organizedProducts.id);
    await this.stacksService.save(this.organizedProducts);
    return true;
  };

  updateStackWithPayment = async (): Promise<boolean> => {
    const user = await this.userService.getUserAfterLogin();
    if (user.stripeConnect) {
      this.organizedProducts.stripeAccessToken = user.stripeConnect.access_token;
      this.organizedProducts.stripeConnectKey = user.stripeConnect.stripe_publishable_key;
      await this.stacksService.save(this.organizedProducts);
      return true;
    }
    // DISPLAY WARNING the first time and them skip
    if (this.errorMessage === text.you_need_stripe_connect) {
      this.errorMessage = text.preview_mode;
      return true;
    }
    this.errorMessage = text.you_need_stripe_connect;
    return false;
  };

  steps: Step[] = [
    { stepNumber: 0, title: 'Choose your stack name', subtitle: `Pick a name that describe this order form` },
    {
      stepNumber: 1,
      title: 'Select products - Step 1/5',
      subtitle: `Remove the products you don't want to appear in your oder from`,
      fn: this.getProducts,
    },
    {
      stepNumber: 2,
      title: 'Set the template - Step 2/5',
      subtitle: `Confirm colours, select sizes, and drag and drop to sequence your styles in order of how you want it.`,
      fn: this.resetError,
    },
    {
      stepNumber: 3,
      title: 'Looking good? - Step 3/5',
      subtitle: `If the sequence of products and sizes are correct, send it to buyers! If not click Previous to go fix whatever you don’t like.`,
      fn: this.resetError,
    },
    {
      stepNumber: 4,
      title: 'Order Form created. Setup Payments now - Step 4/5',
      subtitle: `Congratulations, you have created a new order form. Set up payments now.`,
      fn: this.saveStack,
    },
    {
      stepNumber: 5,
      title: 'Invite your customers to order now! - Step 5/5',
      subtitle: `Recipients will be invited to buy. You can always remove someone’s access by clicking on the “People” in the admin panel,
    finding the person and editing their access.`,
      fn: this.updateStackWithPayment,
    },
  ];
  currentStep: Step = this.steps[0];
  stackName: string;
  products: Product[];
  currencies: Set<string>;
  organizedProducts: OrganizedStacks;
  errorMessage: string;
  loadingText: string;
  shareLink: string;

  constructor(
    public fireData: FireDataService,
    public userService: UserService,
    public stacksService: StacksService,
    private route: ActivatedRoute,
    private router: Router,
    public shopifyService: ShopifyService
  ) {}

  ngOnInit(): void {
    // If coming using menu
    this.userService.on(UserEvent.USER_INFO_AVAILABLE, () => {
      this.route.queryParams.subscribe(async (data) => {
        if (data.stack) {
          const stacks = await this.stacksService.getData(data.stack);
          if (stacks && stacks[0]) {
            const s = new OrganizedStacks(null, null);
            Object.assign(s, stacks[0]);
            this.useExisting(s);
          }
        }
      });
    });
  }

  /**
   * Use existing data
   * @param stack
   */
  useExisting(stack: OrganizedStacks): void {
    this.stackName = stack.id;
    OrganizedStacks.afterDB(stack);
    this.organizedProducts = stack;
  }

  /**
   * Get the stack name from component #0
   * @param name
   */
  getStackName(name: string): void {
    this.stackName = name;
    this.next();
  }

  /**
   * Get the products selectionned during the product step
   */
  getProductsStep2(products: Product[]): void {
    this.products = products;
    this.next();
  }

  /**
   * Getting the organized products from Step 3
   * @param organized
   */
  getOrganizedProductsStep3(organized: OrganizedStacks): void {
    this.organizedProducts = organized;
    // set the owner name
    this.organizedProducts.owner = this.userService.get('companyName');
    this.next();
  }

  /**
   * Get Finalized Products Step 4
   * @param organized
   */
  getFinalizedProductsStep4(organized: OrganizedStacks): void {
    if (organized) {
      this.organizedProducts = organized;
      this.next();
    } else {
      this.previous();
    }
  }

  /**
   * Go to the preview link displayed on the confirmation page
   */
  previewStack(): void {
    this.router.navigate(['invitation'], { queryParams: { id: this.organizedProducts.id } });
  }

  /**
   * Retry loading products
   */
  async retryLoadingProducts(): Promise<void> {
    const updateSubscription: Subscription = interval(5000).subscribe(async (val) => {
      const stores = await this.shopifyService.getData();
      let loading = false;
      for (const store of stores) {
        if (store.status === 'loading') {
          loading = true;
          this.loadingText = `#${val + 1} still loading your products for: ${store.id}, please wait couple of seconds. `;
        }
      }

      // all done loading
      if (!loading) {
        this.errorMessage = '';
        updateSubscription.unsubscribe();
        this.next();
      }
    });
  }

  // Step 6
  inviteCustomers(): void {
    this.next();
    console.log(this.currentStep);
  }

  /**
   * Previous Step
   */
  public previous(): void {
    if (this.currentStep && this.currentStep.stepNumber > 0) {
      this.currentStep = this.steps[this.currentStep.stepNumber - 1];
    }
  }

  /**
   * Next Step
   */
  public async next(): Promise<void> {
    if (this.currentStep && this.currentStep.stepNumber < this.steps.length) {
      const next = this.currentStep.stepNumber + 1;
      let gotoNext = true;
      if (this.steps[next].fn) {
        gotoNext = await this.steps[next].fn();
      }
      if (gotoNext) {
        this.currentStep = this.steps[next];
      }
    }
  }
}
