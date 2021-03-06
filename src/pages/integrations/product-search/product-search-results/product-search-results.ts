import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Logger } from '../../../../providers/logger/logger';

// Providers
import { ConfigProvider } from '../../../../providers/config/config';
import { ExternalLinkProvider } from '../../../../providers/external-link/external-link';
import { ProductSearchProvider } from '../../../../providers/product-search/product-search';

@Component({
  selector: 'product-search-results',
  templateUrl: 'product-search-results.html'
})
export class ProductSearchResultsPage {
  public ssData;
  public amount;
  public amountUnit;

  private defaults;

  constructor(
    private configProvider: ConfigProvider,
    private externalLinkProvider: ExternalLinkProvider,
    private navParams: NavParams,
    private productSearchProvider: ProductSearchProvider,
    private viewCtrl: ViewController,
    private logger: Logger
  ) {
    this.defaults = this.configProvider.getDefaults();
    this.ssData = this.navParams.data.ssData;
    const amountData = this.ssData.amount.split(' ');
    this.amount = amountData[0];
    this.amountUnit = amountData[1];
  }

  ionViewDidLoad() {
    this.logger.info('Loaded: ProductSearchResultsPage');
  }

  public remove() {
    this.productSearchProvider.saveProductSearch(
      this.ssData,
      {
        remove: true
      },
      () => {
        this.close();
      }
    );
  }

  public close() {
    this.viewCtrl.dismiss();
  }

  public openTransaction(id: string) {
    var url;
    if (this.ssData.outgoingType.toUpperCase() == 'BTC') {
      url = 'https://' + this.defaults.blockExplorerUrl.btc + '/tx/' + id;
    } else if (this.ssData.outgoingType.toUpperCase() == 'BCH') {
      url = 'https://' + this.defaults.blockExplorerUrl.bch + '/tx/' + id;
    } else {
      return;
    }
    this.externalLinkProvider.open(url);
  }
}
