import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { initializeApp } from 'firebase/app';
import { FormsModule } from '@angular/forms';
import { CustLoaderComponent } from './components/cust-loader/cust-loader.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { GetProductQuantityComponent } from 'src/app/components/get-product-quantity/get-product-quantity.component';
import { MobileHeaderMenuComponent } from './components/mobile-header-menu/mobile-header-menu.component';
import { AccountMenuInfoComponent } from './components/account-menu-info/account-menu-info.component';
import { SizeDetectorComponent } from './components/size-detector/size-detector.component';
import { ProductDetailsComponent } from './invitation/product-details/product-details.component';
// import { LocationStrategy, HashLocationStrategy } from '@angular/common';
// import { OneSizePipe } from './pipes/one-size/one-size.pipe';
// import { SeparateColorSizePipe } from './pipes/separate-color-size/separate-color-size.pipe';

// Initialize Firebase
const config = {
};

initializeApp(config);
@NgModule({
  declarations: [
    AppComponent,
    /* , OneSizePipe, SeparateColorSizePipe */
    CustLoaderComponent,
    GetProductQuantityComponent,
    MobileHeaderMenuComponent,
    AccountMenuInfoComponent,
    ProductDetailsComponent,
    SizeDetectorComponent
  ],
  entryComponents: [
    CustLoaderComponent,
    GetProductQuantityComponent,
    MobileHeaderMenuComponent,
    AccountMenuInfoComponent,
    ProductDetailsComponent
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, IonicStorageModule.forRoot(), FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    InAppBrowser,
    Stripe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
