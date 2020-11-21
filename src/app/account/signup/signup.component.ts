import { Component, OnInit, NgZone, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Platform, LoadingController, NavController, ToastController, AlertController, PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user/user.service';
import { UserType } from 'src/app/model/user.model';
import slugify from 'slugify';
import { MobileHeaderMenuComponent } from 'src/app/components/mobile-header-menu/mobile-header-menu.component';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errorMsg: string;
  @Input() simpleVersion: boolean;
  @Output() showButtons: EventEmitter<boolean> = new EventEmitter();

  // Various formed used to sign up
  signupForm: FormGroup;
  nameForm: FormGroup;
  passwordForm: FormGroup;
  additionalDataForm: FormGroup;
  companyNameForm: FormGroup;
  domainNameForm: FormGroup;

  // Current signup step
  currentStep = 0;

  subscribeToService = false; // by default not subscribed to any service
  password: string;
  choiceBuyerSeller: string;
  // Fields mapped by ng
  /*
  additionalUserDataOptions: {
    userType: { val: string; disp: string }[];
    productType: { val: string; disp: string }[];
    companyStrength: { val: string; disp: string }[];
    userRoleInCompany: { val: string; disp: string }[];
  } = {
    userType: [{ val: 'buy', disp: 'Buy' }, { val: 'sell', disp: 'Sell' }],

    productType: [
      { val: 'clothing', disp: 'Clothing' },
      { val: 'accessories', disp: 'Accessories' },
      { val: 'footwear', disp: 'Footwear' },
      { val: 'gear', disp: 'Gear' }
    ],

    companyStrength: [
      { val: '1-10', disp: '1-10 people' },
      { val: '11-50', disp: '11-50 people' },
      { val: '50-100', disp: '50-100 people' },
      { val: '100-500', disp: '100-500 people' },
      { val: '500-1000', disp: '500-1000 people' },
      { val: '1000+', disp: '1000+ people' }
    ],

    userRoleInCompany: [
      { val: 'administrator', disp: 'Administrator' },
      { val: 'sales', disp: 'Sales' },
      { val: 'purchasing', disp: 'Purchasing' },
      { val: 'business-owner', disp: 'Business Owner' },
      { val: 'customer-support', disp: 'Customer Support' },
      { val: 'it', disp: 'IT' }
    ]
  }; */

  constructor(
    public formBuilder: FormBuilder,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public userService: UserService,
    public zone: NgZone,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController
  ) {}

  /**
   * ngOnInit()
   */
  ngOnInit(): void {
    this.initializeForms();
  }

  /**
   * Initialize forms
   */
  initializeForms(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

    this.nameForm = this.formBuilder.group({
      fullName: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z ]+$')])],
      // userName: [''],
      sellBuyToggle: false,
      subscribeToService: ['']
    });

    this.passwordForm = this.formBuilder.group({
      password: new FormControl([this.password, Validators.compose([Validators.required, Validators.minLength(6)])]),
      verification: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.additionalDataForm = this.formBuilder.group({
      userType: ['', Validators.compose([Validators.required])],
      productType: ['', Validators.compose([Validators.required])],
      companyStrength: ['', Validators.compose([Validators.required])],
      userRoleInCompany: ['', Validators.compose([Validators.required])],
      isManager: ['', Validators.compose([Validators.required])]
    });

    this.companyNameForm = this.formBuilder.group({
      companyName: ['', Validators.compose([Validators.required])]
    });

    this.domainNameForm = this.formBuilder.group({
      domainName: ['', Validators.compose([Validators.required])]
    });
    // , Validators.pattern('^[a-zA-Z][a-zA-Z0-9-]{1,61}[a-zA-Z0-9][a-zA-Z]{2,}$')
  }

  /**
   * Clicking on the toggle button
   */
  clickSellBuy(): void {
    if (this.nameForm.get('sellBuyToggle').value) {
      this.choiceBuyerSeller = text.signup_user_type_buywholesale;
    } else {
      this.choiceBuyerSeller = text.signup_user_type_sellproducts;
    }
  }

  /**
   * registerUserS1
   * Step #1 which only checks for the email
   */
  async registerUserS1(): Promise<void> {
    if (!this.signupForm.valid) {
      this.errorMsg = text.email_in_use;
      return;
    }

    const email = this.signupForm
      .get('email')
      .value.trim()
      .toLocaleLowerCase(); // triming our email and in lower case

    try {
      const isExist = await this.userService.checkIfEmailExists(email);
      if (isExist) {
        this.errorMsg = text.email_in_use;
        return;
      }
    } catch (err) {
      this.errorMsg = text.generic_error;
      return;
    }

    this.userService.set({ email });
    this.showButtons.emit(false);
    this.goToNextStep();
  }

  /**
   * Step 2 when the user fill their name inside the form
   */
  registerUserS2(): void {
    if (!this.nameForm.valid) {
      return;
    }

    // const sell = this.nameForm.get('sellToggle').value;
    // const buy = this.nameForm.get('buyToggle').value;
    let type: UserType;
    if (this.nameForm.get('sellBuyToggle').value) {
      type = UserType.BUYER;
    } else {
      type = UserType.SELLER;
    }

    this.userService.set({
      type,
      subscribeToService: this.subscribeToService,
      fullName: this.nameForm.get('fullName').value
    });
    this.goToNextStep();
  }

  /**
   * Step 3 register user and password
   */
  async registerUserS3(): Promise<void> {
    if (!this.passwordForm.valid) {
      return;
    }

    if (this.password !== this.passwordForm.get('verification').value) {
      this.errorMsg = text.password_mismatch;
      return;
    }

    this.userService.set({ password: this.password });
    this.goToNextStep();
  }

  /**
   * Step 4 where the user fills in the company name
   */
  async registerUserS4(): Promise<void> {
    if (!this.companyNameForm.valid) {
      return;
    }
    this.userService.set({
      companyName: this.companyNameForm.get('companyName').value,
      slug: slugify(this.companyNameForm.get('companyName').value)
    });
    // find other company that have a slug of wes, wes-1, wes-2
    // const slugRegEx = new RegExp(`^(${this.globals.User.slug})((-[0-9]*$)?)$`, 'i');
    // const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    // if (storesWithSlug.length) {
    //   this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    // }
    await this.showTermsAndCond();
  }

  /**
   * Show terns and conditions
   */
  async showTermsAndCond(): Promise<void> {
    const terms = await this.alertCtrl.create({
      cssClass: 'tnc-alert',
      mode: 'ios',
      header: text.review_terms_title,
      message: text.terms,
      buttons: [
        {
          text: text.agree,
          handler: (): void => {
            this.registerUserFinally();
          }
        }
      ],
      backdropDismiss: false
    });
    terms.present();
  }

  /**
   * Register the user finally
   */
  async registerUserFinally(): Promise<void> {
    try {
      await this.userService.registerUser();
      const toast = await this.toastCtrl.create({
        message: text.account_created,
        duration: 4000,
        position: 'bottom'
      });
      toast.onDidDismiss().then(() => {
        // just wait for the firebase auth service to log the user
      });
      toast.present();
    } catch (err) {
      this.errorMsg = text.error_creating_account;
    }
  }

  /**
   * Open Header Menu
   * @param ev the event
   */
  async openHeaderMenu(ev): Promise<void> {
    const headerPopover = await this.popoverCtrl.create({
      component: MobileHeaderMenuComponent,
      event: ev,
      mode: 'ios'
    });

    await headerPopover.present();

    headerPopover.onDidDismiss().then(data => {
      if (data.data) {
      }
    });
  }

  /**
   * Go to the next step
   */
  goToNextStep(): void {
    this.errorMsg = null; // reset error Message
    this.currentStep++;
  }

  /**
   * Go to the login page, clicked on button
   */
  goToLogin(): void {
    this.navCtrl.navigateRoot('login');
  }
}
