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
    contractId: "CBPNR7NEAP322QVJ3MD3Q6WCLHPTREB2CCMF5U2SPVHILKAH42SFKMI5",
  }
} as const


export interface Scholarship {
  admin: string;
  available_grants: u64;
  details: string;
  end_date: u64;
  id: u64;
  name: string;
  student_grant_amount: i128;
  token: string;
}


export interface Application {
  applicant: string;
  applicant_name: string;
  details: string;
  id: u64;
  scholarship_id: u64;
  status: ApplicationStatus;
}

export type ApplicationStatus = {tag: "Pending", values: void} | {tag: "Approved", values: void} | {tag: "Rejected", values: void};

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
   * Construct and simulate a pick_granted_students transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pick_granted_students: ({scholarship_id, students, caller}: {scholarship_id: u64, students: Array<string>, caller: string}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_my_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_my_scholarships: ({address}: {address: string}, options?: {
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

  /**
   * Construct and simulate a get_my_applications transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_my_applications: ({address}: {address: string}, options?: {
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
   * Construct and simulate a get_applications_frm_schlrship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_applications_frm_schlrship: ({scholarship_id}: {scholarship_id: u64}, options?: {
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
   * Construct and simulate a reject_application transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reject_application: ({application_id}: {application_id: u64}, options?: {
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
  }) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC1NjaG9sYXJzaGlwAAAAAAgAAAAAAAAABWFkbWluAAAAAAAAEwAAAAAAAAAQYXZhaWxhYmxlX2dyYW50cwAAAAYAAAAAAAAAB2RldGFpbHMAAAAAEAAAAAAAAAAIZW5kX2RhdGUAAAAGAAAAAAAAAAJpZAAAAAAABgAAAAAAAAAEbmFtZQAAABAAAAAAAAAAFHN0dWRlbnRfZ3JhbnRfYW1vdW50AAAACwAAAAAAAAAFdG9rZW4AAAAAAAAT",
        "AAAAAQAAAAAAAAAAAAAAC0FwcGxpY2F0aW9uAAAAAAYAAAAAAAAACWFwcGxpY2FudAAAAAAAABMAAAAAAAAADmFwcGxpY2FudF9uYW1lAAAAAAAQAAAAAAAAAAdkZXRhaWxzAAAAABAAAAAAAAAAAmlkAAAAAAAGAAAAAAAAAA5zY2hvbGFyc2hpcF9pZAAAAAAABgAAAAAAAAAGc3RhdHVzAAAAAAfQAAAAEUFwcGxpY2F0aW9uU3RhdHVzAAAA",
        "AAAAAgAAAAAAAAAAAAAAEUFwcGxpY2F0aW9uU3RhdHVzAAAAAAAAAwAAAAAAAAAAAAAAB1BlbmRpbmcAAAAAAAAAAAAAAAAIQXBwcm92ZWQAAAAAAAAAAAAAAAhSZWplY3RlZA==",
        "AAAAAAAAAAAAAAAQcG9zdF9zY2hvbGFyc2hpcAAAAAEAAAAAAAAAC3NjaG9sYXJzaGlwAAAAB9AAAAALU2Nob2xhcnNoaXAAAAAAAQAAA+oAAAfQAAAAC1NjaG9sYXJzaGlwAA==",
        "AAAAAAAAAAAAAAAFYXBwbHkAAAAAAAABAAAAAAAAAAthcHBsaWNhdGlvbgAAAAfQAAAAC0FwcGxpY2F0aW9uAAAAAAEAAAPqAAAH0AAAAAtBcHBsaWNhdGlvbgA=",
        "AAAAAAAAAAAAAAAQZ2V0X3NjaG9sYXJzaGlwcwAAAAAAAAABAAAD6gAAB9AAAAALU2Nob2xhcnNoaXAA",
        "AAAAAAAAAAAAAAAVcGlja19ncmFudGVkX3N0dWRlbnRzAAAAAAAAAwAAAAAAAAAOc2Nob2xhcnNoaXBfaWQAAAAAAAYAAAAAAAAACHN0dWRlbnRzAAAD6gAAABMAAAAAAAAABmNhbGxlcgAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAATZ2V0X215X3NjaG9sYXJzaGlwcwAAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAD6gAAB9AAAAALU2Nob2xhcnNoaXAA",
        "AAAAAAAAAAAAAAAQZ2V0X2FwcGxpY2F0aW9ucwAAAAAAAAABAAAD6gAAB9AAAAALQXBwbGljYXRpb24A",
        "AAAAAAAAAAAAAAATZ2V0X215X2FwcGxpY2F0aW9ucwAAAAABAAAAAAAAAAdhZGRyZXNzAAAAABMAAAABAAAD6gAAB9AAAAALQXBwbGljYXRpb24A",
        "AAAAAAAAAAAAAAAeZ2V0X2FwcGxpY2F0aW9uc19mcm1fc2NobHJzaGlwAAAAAAABAAAAAAAAAA5zY2hvbGFyc2hpcF9pZAAAAAAABgAAAAEAAAPqAAAH0AAAAAtBcHBsaWNhdGlvbgA=",
        "AAAAAAAAAAAAAAAScmVqZWN0X2FwcGxpY2F0aW9uAAAAAAABAAAAAAAAAA5hcHBsaWNhdGlvbl9pZAAAAAAABgAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    post_scholarship: this.txFromJSON<Array<Scholarship>>,
        apply: this.txFromJSON<Array<Application>>,
        get_scholarships: this.txFromJSON<Array<Scholarship>>,
        pick_granted_students: this.txFromJSON<null>,
        get_my_scholarships: this.txFromJSON<Array<Scholarship>>,
        get_applications: this.txFromJSON<Array<Application>>,
        get_my_applications: this.txFromJSON<Array<Application>>,
        get_applications_frm_schlrship: this.txFromJSON<Array<Application>>,
        reject_application: this.txFromJSON<null>
  }
}