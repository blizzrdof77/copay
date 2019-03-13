import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Logger } from '../../providers/logger/logger';

// providers
import { AppProvider } from '../app/app';
import { ConfigProvider } from '../config/config';
import { HomeIntegrationsProvider } from '../home-integrations/home-integrations';
import { PersistenceProvider } from '../persistence/persistence';

@Injectable()
export class ProductSearchProvider {
    private credentials;

  constructor(
        private appProvider: AppProvider,
        private homeIntegrationsProvider: HomeIntegrationsProvider,
        private http: HttpClient,
        private logger: Logger,
        private configProvider: ConfigProvider,
        // private persistenceProvider: PersistenceProvider
    ) {
        this.logger.debug('Product Search module initialized');
    }

  public register(): void {
    this.homeIntegrationsProvider.register({
      name: 'productsearch',
      title: 'ProductSearch',
      icon: 'assets/img/product-search/product-search-icon.svg',
      page: 'ProductSearchPage',
      show: !!this.configProvider.get().showIntegration['productsearch']
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
        const error = this.parseError(data);
        this.logger.error('Search product ERROR: ' + error);
        return cb(error);
      }
    );
  }

  /* TODO */
  public getStatus(addr: string, cb) {
    return true;
  }

);
}
