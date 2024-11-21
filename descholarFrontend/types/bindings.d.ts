declare module 'bindings' {
  export interface Scholarship {
    name: string;
    details: string;
    available_grants: number;
    total_grant_amount: bigint;
    end_date: number;
    admin: string;
  }

  export interface Networks {
    testnet: {
      contractId: string;
      networkPassphrase: string;
    }
  }

  export class Client {
    constructor(options: {
      contractId: string;
      networkPassphrase: string;
      rpcUrl: string;
    });
    get_scholarships(): Promise<any>;
  }

  export const networks: Networks;
} 