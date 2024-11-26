import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
} from "@stellar/stellar-sdk/contract";
import type { u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
  readonly testnet: {
    readonly networkPassphrase: "Test SDF Network ; September 2015";
    readonly contractId: "CBPNR7NEAP322QVJ3MD3Q6WCLHPTREB2CCMF5U2SPVHILKAH42SFKMI5";
  };
};
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
export type ApplicationStatus =
  | {
      tag: "Pending";
      values: void;
    }
  | {
      tag: "Approved";
      values: void;
    }
  | {
      tag: "Rejected";
      values: void;
    };
export declare const Errors: {};
export interface Client {
  /**
   * Construct and simulate a post_scholarship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  post_scholarship: (
    {
      scholarship,
    }: {
      scholarship: Scholarship;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<Array<Scholarship>>>;
  /**
   * Construct and simulate a apply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  apply: (
    {
      application,
    }: {
      application: Application;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<Array<Application>>>;
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
  }) => Promise<AssembledTransaction<Array<Scholarship>>>;
  /**
   * Construct and simulate a pick_granted_students transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  pick_granted_students: (
    {
      scholarship_id,
      students,
      caller,
    }: {
      scholarship_id: u64;
      students: Array<string>;
      caller: string;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;
  /**
   * Construct and simulate a get_my_scholarships transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_my_scholarships: (
    {
      address,
    }: {
      address: string;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<Array<Scholarship>>>;
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
  }) => Promise<AssembledTransaction<Array<Application>>>;
  /**
   * Construct and simulate a get_my_applications transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_my_applications: (
    {
      address,
    }: {
      address: string;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<Array<Application>>>;
  /**
   * Construct and simulate a get_applications_frm_schlrship transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_applications_frm_schlrship: (
    {
      scholarship_id,
    }: {
      scholarship_id: u64;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<Array<Application>>>;
  /**
   * Construct and simulate a reject_application transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  reject_application: (
    {
      application_id,
    }: {
      application_id: u64;
    },
    options?: {
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
    }
  ) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
  readonly options: ContractClientOptions;
  constructor(options: ContractClientOptions);
  readonly fromJSON: {
    post_scholarship: (json: string) => AssembledTransaction<Scholarship[]>;
    apply: (json: string) => AssembledTransaction<Application[]>;
    get_scholarships: (json: string) => AssembledTransaction<Scholarship[]>;
    pick_granted_students: (json: string) => AssembledTransaction<null>;
    get_my_scholarships: (json: string) => AssembledTransaction<Scholarship[]>;
    get_applications: (json: string) => AssembledTransaction<Application[]>;
    get_my_applications: (json: string) => AssembledTransaction<Application[]>;
    get_applications_frm_schlrship: (
      json: string
    ) => AssembledTransaction<Application[]>;
    reject_application: (json: string) => AssembledTransaction<null>;
  };
}
