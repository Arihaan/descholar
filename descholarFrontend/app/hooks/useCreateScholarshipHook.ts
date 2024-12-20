import { kit } from "../stellar-wallets-kit";
import { Client, networks, rpc } from "../../bindings/dist";
import { Networks, TransactionBuilder, Soroban } from "@stellar/stellar-sdk";
import { u64, i128 } from "@stellar/stellar-sdk/contract";

interface Scholarship {
  admin: string;
  available_grants: u64;
  details: string;
  end_date: u64;
  id: u64;
  name: string;
  student_grant_amount: i128;
  token: string;
}

export async function useCreateScholarship() {
  const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: SOROBAN_RPC_URL,
  });

  const createScholarship = async (scholarship: Scholarship) => {
    try {
      // Get user address
      const { address } = await kit.getAddress();

      // Prepare scholarship data
      const scholarshipData: Scholarship = {
        ...scholarship,
        admin: address,
        token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      };

      // 1. Prepare transaction
      const transaction = await scholarshipContract.post_scholarship({
        scholarship: scholarshipData,
      });

      // 2. Convert to XDR
      const xdr = transaction.toXDR();

      // 3. Sign transaction
      const signedResult = await kit.signTransaction(xdr, {
        address: address,
        networkPassphrase: Networks.TESTNET,
      });

      // 4. Convert signed XDR back to transaction
      const signedTx = TransactionBuilder.fromXDR(
        signedResult.signedTxXdr,
        Networks.TESTNET
      );

      // 5. Setup server and send transaction
      const server = new rpc.Server(SOROBAN_RPC_URL);

      // 6. First simulate the transaction
      const simResult: any = await server.simulateTransaction(signedTx);
      if (simResult.error) {
        //it fails here
        console.log(simResult);
        return;
        // throw new Error(`Simulation failed: ${simResult.error}`);
      }

      // 7. Send the transaction
      const preparedTx = await server.prepareTransaction(signedTx);
      console.log("Prepared transaction:", preparedTx);

      const result = await server.sendTransaction(preparedTx);
      console.log("Transaction successful:", result);
      return result;
    } catch (error: any) {
      console.error("Transaction failed:", error);
      throw new Error(error?.message || "Transaction failed");
    }
  };

  return { createScholarship };
}
