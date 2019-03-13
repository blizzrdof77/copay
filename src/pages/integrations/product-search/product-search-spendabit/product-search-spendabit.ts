import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

// import { BuyProductPage } from '../buy-product/buy-product';

import { ActionSheetProvider } from '../../../../providers';
import { ProductSearchProvider } from '../../../../providers/product-search/product-search';
// import {
//   ProductConfig,
//   ProductName
// } from '../../../../providers/search-product/search-product.types';
import { WideHeaderPage } from '../../../templates/wide-header-page/wide-header-page';

@Component({
  selector: 'product-search-spendabit-page',
  templateUrl: 'product-search-spendabit.html'
})
export class ProductSearchSpendabitPage implements OnInit {
  // public allProducts: ProductConfig[];
  // public featuredProducts: ProductConfig[];
  // public moreProducts: ProductConfig[];
  public searchQuery: string = '';

  @ViewChild(WideHeaderPage)
  wideHeaderPage: WideHeaderPage;

  constructor(
    private actionSheetProvider: ActionSheetProvider,
    private productSearchProvider: ProductSearchProvider,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.allProducts = await this.productSearchProvider.getAvailableProducts().catch(_ => {
      this.showError();
      return [] as ProductConfig[];
    });
    this.updateProductList();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.updateProductList();
  }

  updateProductList() {
    const matchingProducts = this.allProducts.filter(c =>
      isProductInSearchResults(c, this.searchQuery)
    );
    this.featuredProducts = matchingProducts.filter(c => isProductFeatured(c));
    this.moreProducts = matchingProducts.filter(c => !isProductFeatured(c));
  }

  buyProduct(productConfig: ProductConfig) {
    this.navCtrl.push(BuyProductPage, { productConfig });
  }

  private showError() {
    const errorInfoSheet = this.actionSheetProvider.createInfoSheet(
      'product-search-unavailable'
    );
    errorInfoSheet.present();
    errorInfoSheet.onDidDismiss(() => this.navCtrl.pop());
  }
}

export function isProductFeatured(c: ProductConfig) {
  const featuredProductNames = [
  ];
  return featuredProductNames.indexOf(c.name) !== -1;
}

export function isProductInSearchResults(c: ProductConfig, search: string) {
  const productName = c.name.toLowerCase();
  const query = search.toLowerCase();
  const matchableText = [productName, stripPunctuation(productName)];
  return matchableText.some(text => text.indexOf(query) > -1);
}

export function stripPunctuation(text: string) {
  return text.replace(/[^\w\s]|_/g, '');
}
