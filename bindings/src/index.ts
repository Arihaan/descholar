import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBFS7UBCKLEDMHD6A56FZ745H5EXNE3UMASU3IHJJOULRPOE2FTLLQGK",
  }
} as const


export interface Scholarship {
  available_grants: u32;
  details: string;
  end_date: u64;
  name: string;
  total_grant_amount: i128;
}


export interface Application {
  applicant: string;
  details: string;
  scholarship_name: string;
}

export const Errors = {

}

export interface Client {
  /**
   * Construct and simulate a post_scholarship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  post_scholarship: ({scholarship}: {scholarship: Scholarship}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Scholarship>>>

  /**
   * Construct and simulate a apply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  apply: ({application}: {application: Application}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Application>>>

  /**
   * Construct and simulate a get_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_scholarships: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Scholarship>>>

  /**
   * Construct and simulate a get_applications transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_applications: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Application>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC1NjaG9sYXJzaGlwAAAAAAUAAAAAAAAAEGF2YWlsYWJsZV9ncmFudHMAAAAEAAAAAAAAAAdkZXRhaWxzAAAAABAAAAAAAAAACGVuZF9kYXRlAAAABgAAAAAAAAAEbmFtZQAAABAAAAAAAAAAEnRvdGFsX2dyYW50X2Ftb3VudAAAAAAACw==",
        "AAAAAQAAAAAAAAAAAAAAC0FwcGxpY2F0aW9uAAAAAAMAAAAAAAAACWFwcGxpY2FudAAAAAAAABMAAAAAAAAAB2RldGFpbHMAAAAAEAAAAAAAAAAQc2Nob2xhcnNoaXBfbmFtZQAAABA=",
        "AAAAAAAAAAAAAAAQcG9zdF9zY2hvbGFyc2hpcAAAAAEAAAAAAAAAC3NjaG9sYXJzaGlwAAAAB9AAAAALU2Nob2xhcnNoaXAAAAAAAQAAA+oAAAfQAAAAC1NjaG9sYXJzaGlwAA==",
        "AAAAAAAAAAAAAAAFYXBwbHkAAAAAAAABAAAAAAAAAAthcHBsaWNhdGlvbgAAAAfQAAAAC0FwcGxpY2F0aW9uAAAAAAEAAAPqAAAH0AAAAAtBcHBsaWNhdGlvbgA=",
        "AAAAAAAAAAAAAAAQZ2V0X3NjaG9sYXJzaGlwcwAAAAAAAAABAAAD6gAAB9AAAAALU2Nob2xhcnNoaXAA",
        "AAAAAAAAAAAAAAAQZ2V0X2FwcGxpY2F0aW9ucwAAAAAAAAABAAAD6gAAB9AAAAALQXBwbGljYXRpb24A" ]),
      options
    )
  }
  public readonly fromJSON = {
    post_scholarship: this.txFromJSON<Array<Scholarship>>,
        apply: this.txFromJSON<Array<Application>>,
        get_scholarships: this.txFromJSON<Array<Scholarship>>,
        get_applications: this.txFromJSON<Array<Application>>
  }
}