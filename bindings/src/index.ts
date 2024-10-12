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
    contractId: "CDGKLFSDSVKDNFJHDXFIIU3T4RBRZFTG5R2XFF5ZH6CADUB2LKJSTRNC",
  }
} as const


export interface Scholarship {
  applicants: Array<string>;
  creator: string;
  details: string;
  end_date: u64;
  id: ScholarshipId;
  name: string;
  num_grants: u32;
  total_amount: i128;
}

export type ScholarshipId = readonly [u64];
export type DataKey = {tag: "ScholarshipIds", values: void};

export const Errors = {
  1: {message:"InvalidScholarshipParameters"},

  2: {message:"ScholarshipEnded"},

  3: {message:"AlreadyApplied"},

  4: {message:"NotScholarshipCreator"},

  5: {message:"NoGrantsAvailable"},

  6: {message:"ApplicantNotFound"},

  7: {message:"InsufficientFunds"}
}

export interface Client {
  /**
   * Construct and simulate a create_scholarship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_scholarship: ({name, details, num_grants, total_amount, end_date, creator}: {name: string, details: string, num_grants: u32, total_amount: i128, end_date: u64, creator: string}, options?: {
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
  }) => Promise<AssembledTransaction<ScholarshipId>>

  /**
   * Construct and simulate a get_all_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_all_scholarships: (options?: {
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
   * Construct and simulate a apply_for_scholarship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  apply_for_scholarship: ({scholarship_id, applicant}: {scholarship_id: ScholarshipId, applicant: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a approve_applicant transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  approve_applicant: ({scholarship_id, applicant, creator}: {scholarship_id: ScholarshipId, applicant: string, creator: string}, options?: {
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
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_applicants transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_applicants: ({scholarship_id}: {scholarship_id: ScholarshipId}, options?: {
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
  }) => Promise<AssembledTransaction<Array<string>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC1NjaG9sYXJzaGlwAAAAAAgAAAAAAAAACmFwcGxpY2FudHMAAAAAA+oAAAATAAAAAAAAAAdjcmVhdG9yAAAAABMAAAAAAAAAB2RldGFpbHMAAAAAEAAAAAAAAAAIZW5kX2RhdGUAAAAGAAAAAAAAAAJpZAAAAAAH0AAAAA1TY2hvbGFyc2hpcElkAAAAAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAKbnVtX2dyYW50cwAAAAAABAAAAAAAAAAMdG90YWxfYW1vdW50AAAACw==",
        "AAAAAQAAAAAAAAAAAAAADVNjaG9sYXJzaGlwSWQAAAAAAAABAAAAAAAAAAEwAAAAAAAABg==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAAAAAAAAAAADlNjaG9sYXJzaGlwSWRzAAA=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAAcSW52YWxpZFNjaG9sYXJzaGlwUGFyYW1ldGVycwAAAAEAAAAAAAAAEFNjaG9sYXJzaGlwRW5kZWQAAAACAAAAAAAAAA5BbHJlYWR5QXBwbGllZAAAAAAAAwAAAAAAAAAVTm90U2Nob2xhcnNoaXBDcmVhdG9yAAAAAAAABAAAAAAAAAARTm9HcmFudHNBdmFpbGFibGUAAAAAAAAFAAAAAAAAABFBcHBsaWNhbnROb3RGb3VuZAAAAAAAAAYAAAAAAAAAEUluc3VmZmljaWVudEZ1bmRzAAAAAAAABw==",
        "AAAAAAAAAAAAAAASY3JlYXRlX3NjaG9sYXJzaGlwAAAAAAAGAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAHZGV0YWlscwAAAAAQAAAAAAAAAApudW1fZ3JhbnRzAAAAAAAEAAAAAAAAAAx0b3RhbF9hbW91bnQAAAALAAAAAAAAAAhlbmRfZGF0ZQAAAAYAAAAAAAAAB2NyZWF0b3IAAAAAEwAAAAEAAAfQAAAADVNjaG9sYXJzaGlwSWQAAAA=",
        "AAAAAAAAAAAAAAAUZ2V0X2FsbF9zY2hvbGFyc2hpcHMAAAAAAAAAAQAAA+oAAAfQAAAAC1NjaG9sYXJzaGlwAA==",
        "AAAAAAAAAAAAAAAVYXBwbHlfZm9yX3NjaG9sYXJzaGlwAAAAAAAAAgAAAAAAAAAOc2Nob2xhcnNoaXBfaWQAAAAAB9AAAAANU2Nob2xhcnNoaXBJZAAAAAAAAAAAAAAJYXBwbGljYW50AAAAAAAAEwAAAAEAAAPpAAAD7QAAAAAAAAAD",
        "AAAAAAAAAAAAAAARYXBwcm92ZV9hcHBsaWNhbnQAAAAAAAADAAAAAAAAAA5zY2hvbGFyc2hpcF9pZAAAAAAH0AAAAA1TY2hvbGFyc2hpcElkAAAAAAAAAAAAAAlhcHBsaWNhbnQAAAAAAAATAAAAAAAAAAdjcmVhdG9yAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAOZ2V0X2FwcGxpY2FudHMAAAAAAAEAAAAAAAAADnNjaG9sYXJzaGlwX2lkAAAAAAfQAAAADVNjaG9sYXJzaGlwSWQAAAAAAAABAAAD6gAAABM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    create_scholarship: this.txFromJSON<ScholarshipId>,
        get_all_scholarships: this.txFromJSON<Array<Scholarship>>,
        apply_for_scholarship: this.txFromJSON<Result<void>>,
        approve_applicant: this.txFromJSON<Result<void>>,
        get_applicants: this.txFromJSON<Array<string>>
  }
}