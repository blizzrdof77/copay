import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppProvider } from '../../../../providers/app/app';
// import { IonicFormInput, IonicModule } from 'ionic-angular';
import { ConfigProvider } from '../../../../providers/config/config';
import { Logger } from '../../../../providers/logger/logger';
import { ProductSearchProvider } from './../../../../providers/product-search/product-search';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent {
  private credentials;

  constructor(
    private appProvider: AppProvider,
    private productSearchProvider: ProductSearchProvider,
    private http: HttpClient,
    private logger: Logger,
    private configProvider: ConfigProvider // private persistenceProvider: PersistenceProvider
  ) {
    this.logger.debug('Product Search module initialized');
  }

  public register(): void {
    this.productSearchProvider.register({
      name: 'productsearch',
      title: 'ProductSearch',
      icon: 'assets/img/product-search/product-search-icon.svg',
      page: 'ProductSearchPage',
      show: true
      // XXX: Need to do this properly before merging
      // show: !!this.configProvider.get().showIntegration['productsearch']
    });
  }

  public init = _.throttle(cb => {
    this.logger.debug('init product search');
  }, 10000);

  public searchProducts(data, cb) {
    const dataSrc = {
      searchQuery: data.productSearch
    };

    var searchQuery = 'iphone';

    const url = 'https://spendabit.co/search?q=' + searchQuery;
    // const headers = new HttpHeaders({
    // 'Content-Type': 'application/json',
    // Accept: 'application/json'
    // Authorization: 'Bearer ' + data.token
    // });

    this.http.get(url).subscribe(
      data => {
        this.logger.info('Search product: SUCCESS');
        return cb(null, data);
      },
      data => {
        // const error = this.parseError(data);
        this.logger.error('Search product ERROR: ' + error);
        return cb(error);
      }
    );
  }

  /* TODO */
  public getStatus(addr: string, cb) {
    return true;
  }
}
