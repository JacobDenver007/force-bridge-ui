import isEqual from 'lodash.isequal';
import { FungibleBaseInfo } from '../../types';

// const DEFAULT_UNKNOWN_DATA_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 973.1 973.1" style="enable-background:new 0 0 973.1 973.1;" xml:space="preserve" > <g> <path d="M502.29,788.199h-47c-33.1,0-60,26.9-60,60v64.9c0,33.1,26.9,60,60,60h47c33.101,0,60-26.9,60-60v-64.9 C562.29,815,535.391,788.199,502.29,788.199z"/> <path d="M170.89,285.8l86.7,10.8c27.5,3.4,53.6-12.4,63.5-38.3c12.5-32.7,29.9-58.5,52.2-77.3c31.601-26.6,70.9-40,117.9-40 c48.7,0,87.5,12.8,116.3,38.3c28.8,25.6,43.1,56.2,43.1,92.1c0,25.8-8.1,49.4-24.3,70.8c-10.5,13.6-42.8,42.2-96.7,85.9 c-54,43.7-89.899,83.099-107.899,118.099c-18.4,35.801-24.8,75.5-26.4,115.301c-1.399,34.1,25.8,62.5,60,62.5h49 c31.2,0,57-23.9,59.8-54.9c2-22.299,5.7-39.199,11.301-50.699c9.399-19.701,33.699-45.701,72.699-78.1 C723.59,477.8,772.79,428.4,795.891,392c23-36.3,34.6-74.8,34.6-115.5c0-73.5-31.3-138-94-193.4c-62.6-55.4-147-83.1-253-83.1 c-100.8,0-182.1,27.3-244.1,82c-52.8,46.6-84.9,101.8-96.2,165.5C139.69,266.1,152.39,283.5,170.89,285.8z"/></g></svg>`;
// const DEFAULT_UNKNOWN_SYMBOL = 'unknown';

export interface FullAssetPayload {
  network: string;
  ident: string;
  amount?: string;
  info?: FungibleBaseInfo;
  isNative?: boolean;

  shadow?: Asset;
}

export interface AssetPayload {
  ident: string;
  shadow?: Asset;
  amount?: string;
  info?: FungibleBaseInfo;
}

export abstract class Asset {
  network: string;
  ident: string;
  amount: string;

  isNative: boolean;

  info?: FungibleBaseInfo;
  shadow?: Asset;

  protected constructor(options: FullAssetPayload) {
    this.network = options.network;
    this.ident = options.ident;

    this.amount = options.amount ?? '0';
    this.isNative = options.isNative ?? false;
    this.info = options.info;
    this.shadow = options.shadow;
  }

  setShadow(shadowAsset: Asset): void {
    this.shadow = shadowAsset;
  }

  setAmount(amount: string): void {
    this.amount = amount;
  }

  equals(another: Asset): boolean {
    return this.network === another.network && isEqual(this.ident, another.ident);
  }

  serialize(): FullAssetPayload {
    return {
      network: this.network,
      ident: this.ident,
      amount: this.amount,
      isNative: this.isNative,

      ...(this.info ? { info: this.info } : {}),
    };
  }

  identity(): string {
    return `${this.network}/${this.ident}`;
  }
}
