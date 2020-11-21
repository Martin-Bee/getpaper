/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './providers/auth/auth.service';
import { LSUAuthService } from './providers/auth/lsuauth.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    canActivate: [LSUAuthService]
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthService]
  },
  {
    path: 'list-unused-old-ionic',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'signup',
    loadChildren: './account/signup-page/signup.module#SignupPageModule',
    canActivate: [LSUAuthService]
  },
  {
    path: 'brand-dashboard',
    loadChildren: './brand/brand-dashboard/brand-dashboard.module#BrandDashboardPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'brand-home',
    loadChildren: './brand/brand-home/brand-home.module#BrandHomePageModule',
    canActivate: [AuthService]
  },
  {
    path: 'brand-stacks',
    loadChildren: './brand/brand-stacks/brand-stacks.module#BrandStacksPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'setup-stripe-connect',
    loadChildren: './brand/stripe-setup/stripe-setup.module#StripeSetupPageModule',
    canActivate: [AuthService]
  },
  {
    path: 'invitation',
    loadChildren: './invitation/invitation.module#InvitationPageModule'
  },
  {
    path: 'login',
    loadChildren: './account/login-page/login.module#LoginPageModule',
    canActivate: [LSUAuthService]
  },
  {
    path: 'forgot-password',
    loadChildren: './account/forgot-password/forgot-password.module#ForgotPasswordPageModule',
    canActivate: [LSUAuthService]
  },
  {
    path: 'account-info',
    loadChildren: () => import('./account/account-info/account-info.module').then(m => m.AccountInfoPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'account-security',
    loadChildren: () => import('./account/account-security/account-security.module').then(m => m.AccountSecurityPageModule),
    canActivate: [AuthService]
  },
  {
    path: 'stripe-setup',
    loadChildren: () => import('./brand/stripe-setup/stripe-setup.module').then(m => m.StripeSetupPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
