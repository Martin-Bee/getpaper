import { AlertController } from '@ionic/angular';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { generateUID } from './gen-id';

@Injectable({
  providedIn: 'root'
})
export class SDialog {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private alertCtrl: AlertController) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Alert UI To add logo
   * @param custClass the css class added as the header
   */
  alertAddLogo(custClass: string): void {
    const targetEle = custClass + ' .alert-head .alert-title';
    const element = this.renderer.selectRootElement(targetEle);
    element.innerHTML = '<img src="/assets/logo/logoImg.png" />';
  }

  /**
   *
   * @param buttonText the text for the button
   * @param header the header message
   * @param message the main message
   * @param handler the handler
   */
  async createSuccessDialog(buttonText: string, header: string, message: string, handler?: () => void): Promise<void> {
    const cssClass = `header-${generateUID()}`;
    const alert = await this.alertCtrl.create({
      cssClass: [cssClass, 'success-alert'],
      header: 'logo',
      mode: 'ios',
      subHeader: header,
      message,
      buttons: [
        {
          text: buttonText,
          handler
        }
      ],
      backdropDismiss: false
    });
    alert.present();
    this.alertAddLogo(`.${cssClass}`);
  }
}
