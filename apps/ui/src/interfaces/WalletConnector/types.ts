import { NervosNetwork, NetworkBase, Signer } from '@force-bridge/commons';

export enum ConnectStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Disconnected = 'Disconnected',
}

export interface TwoWayIdentity<T extends NetworkBase> {
  identOrigin(): T['UserIdent'];

  identNervos(): NervosNetwork['UserIdent'];

  // get the signer identity, maybe an address of Ethereum or an account name of EOS
  identityOrigin(): string;

  // get the signer identity of Nervos, e.g. ckt....
  identityNervos(): string;
}

// Since Nervos supports multiple signatures,
// a TwoWaySigner is able to sign Nervos transactions as well as transactions from the other network
export interface TwoWaySigner<T extends NetworkBase = NetworkBase>
  extends Signer<
      T['RawTransaction'] | NervosNetwork['RawTransaction'],
      T['SignedTransaction'] | NervosNetwork['SignedTransaction']
    >,
    TwoWayIdentity<T> {}

export interface Wallet<T extends NetworkBase = NetworkBase> {
  // connect to the wallet
  connect(): void;

  // connect silently
  connectSilent(): void;

  // disconnect the wallet
  disconnect(): void;

  // an event triggered when signer has changed, cases that include signer unmount
  on(event: 'signerChanged', listener: (signer: TwoWaySigner<T> | undefined) => void): void;

  // an event triggered when connect status was changed
  on(event: 'connectStatusChanged', listener: (status: ConnectStatus) => void): void;

  // an event triggered when an error occurred
  on(event: 'error', listener: <E extends Error>(error: E) => void): void;
}
