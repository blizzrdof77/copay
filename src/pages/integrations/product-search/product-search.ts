import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  App,
  Events,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';
import * as _ from 'lodash';
import { Logger } from '../../../providers/logger/logger';

// Pages
import { TabsPage } from '../../tabs/tabs';
// import { ProductSearchresultsPage } from './product-search-results/product-search-results';
// import { ProductSearchSpendabitPage } from './product-search-spendabit/product-search-spendabit';

// Providers
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalLinkProvider } from '../../../providers/external-link/external-link';
import { PopupProvider } from '../../../providers/popup/popup';
import { TimeProvider } from '../../../providers/time/time';

export class ProductSearchPage {
  public products;
  public network: string;
  public loading: boolean;
  public error: string;

  constructor(
    private app: App,
    private events: Events,
    private externalLinkProvider: ExternalLinkProvider,
    private logger: Logger,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private productSearchProvider: ProductSearchProvider,
    private timeProvider: TimeProvider,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    protected translate: TranslateService,
    private popupProvider: PopupProvider
  ) {
    // this.network = this.productSearchProvider.getNetwork();
    this.products = { data: {} };
  }

  ionViewDidLoad() {
    this.logger.info('Loaded: ProductSearchPage');
  }

  ionViewWillEnter() {
    // if (this.navParams.data.code) {
    //   this.productSearchProvider.getStoredToken((at: string) => {
    //     at ? this.init() : this.submitOauthCode(this.navParams.data.code);
    //   });
    // } else {
      this.init();
    // }

    this.events.subscribe('bwsEvent', (_, type: string) => {
      this.updateResults(this.products);
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('bwsEvent');
  }

  private init(): void {
    this.loading = true;
    console.log('loading spendabit!');
    // this.productSearchProvider.getStoredToken((at: string) => {
    //   this.accessToken = at;
    //   // Update Access Token if necessary
    //   this.productSearchProvider.init((err, data) => {
    //     if (err || _.isEmpty(data)) {
    //       this.loading = false;
    //       if (err) {
    //         this.logger.error(err);
    //         this.loading = false;
    //         if (err == 'unverified_account') {
    //           this.openShafeSpendabitWindow();
    //         } else {
    //           this.popupProvider
    //             .ionicAlert(
    //               this.translate.instant('Error connecting to ProductSearch'),
    //               err
    //             )
    //             .then(() => {
    //               this.productSearchProvider.logout(this.accessToken);
    //               this.app.getRootNavs()[0].setRoot(TabsPage);
    //             });
    //         }
    //       }
    //       return;
    //     }

    //     this.productSearchProvider.getProductSearch((err, ss) => {
    //       this.loading = false;
    //       if (err) this.logger.error(err);
    //       if (ss) this.products = { data: ss };
    //       this.updateResults(this.products);
    //     });
    //   });
    // });
  }

  public openExternalLink(url: string): void {
    this.externalLinkProvider.open(url);
  }

  private updateResults() {
    alert('updating results!');
  }
  // _.debounce(
    // products => {
    //   if (_.isEmpty(products.data)) return;
    //   _.forEach(products.data, dataFromStorage => {
    //     if (!this.checkIfSpendabitNeedsUpdate(dataFromStorage)) return;

    //     this.productSearchProvider.getStatus(
    //       dataFromStorage.address,
    //       this.accessToken,
    //       (err, st) => {
    //         if (err) return;

    //         this.products.data[st.address].status = st.status;
    //         this.products.data[st.address].transaction = st.transaction || null;
    //         this.products.data[st.address].incomingCoin = st.incomingCoin || null;
    //         this.products.data[st.address].incomingType = st.incomingType || null;
    //         this.products.data[st.address].outgoingCoin = st.outgoingCoin || null;
    //         this.products.data[st.address].outgoingType = st.outgoingType || null;
    //         this.productSearchProvider.saveProductSearch(
    //           this.products.data[st.address],
    //           null,
    //           () => {
    //             this.logger.debug('Saved product with status: ' + st.status);
    //           }
    //         );
    //       }
    //     );
    //   });
    // },
    // 1000,
    // {
    //   leading: true
    // }
  // );

  // private checkIfSpendabitNeedsUpdate(productData) {
  //   // Continues normal flow (update productData)
  //   if (productData.status == 'received') {
  //     return true;
  //   }
  //   // Check if productData status FAILURE for 24 hours
  //   if (
  //     (productData.status == 'failed' || productData.status == 'no_deposits') &&
  //     this.timeProvider.withinPastDay(productData.date)
  //   ) {
  //     return true;
  //   }
  //   // If status is complete: do not update
  //   // If status fails or do not receive deposits for more than 24 hours: do not update
  //   return false;
  // }

  public update(): void {
    this.updateResults(this.products);
  }

  public openSpendabitModal(ssData) {
    const modal = this.modalCtrl.create(ProductSearchresultsPage, { ssData });

    modal.present();

    modal.onDidDismiss(() => {
      this.init();
    });
  }

  public goTo(page: string): void {
    switch (page) {
      case 'Spendabit':
        this.navCtrl.push(ProductSearchSpendabitPage);
        break;
    }
  }

  public openAuthenticateWindow(): void {
    this.showOauthForm = true;
    const oauthUrl = this.productSearchProvider.getOauthCodeUrl();
    this.externalLinkProvider.open(oauthUrl);
  }

  private openShafeSpendabitWindow(): void {
    const url = 'https://portal.product-search.io/me/fox/dashboard';
    const optIn = true;
    const title = this.translate.instant('Unverified Account');
    const message = this.translate.instant(
      'Do you want to verify your account now?'
    );
    const okText = this.translate.instant('Verify Account');
    const cancelText = this.translate.instant('Cancel');
    this.externalLinkProvider
      .open(url, optIn, title, message, okText, cancelText)
      .then(() => {
        this.app.getRootNavs()[0].setRoot(TabsPage);
      });
  }

  public openSignupWindow(): void {
    const url = this.productSearchProvider.getSignupUrl();
    const optIn = true;
    const title = 'Sign Up for ProductSearch';
    const message =
      'This will open product-search.io, where you can create an account.';
    const okText = 'Go to ProductSearch';
    const cancelText = 'Back';
    this.externalLinkProvider.open(
      url,
      optIn,
      title,
      message,
      okText,
      cancelText
    );
  }

  public submitOauthCode(code: string): void {
    this.onGoingProcessProvider.set('connectingProductSearch');
    this.productSearchProvider.getToken(code, (err: any, accessToken: string) => {
      this.onGoingProcessProvider.clear();
      if (err) {
        this.error = err;
        this.logger.error('Error connecting to ProductSearch: ' + err);
        return;
      }
      this.navCtrl.pop();
      this.accessToken = accessToken;
      this.init();
    });
  }
}
