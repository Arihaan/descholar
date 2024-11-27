import { kit } from "../stellar-wallets-kit";
import { Client, networks, Scholarship, rpc } from "@/bindings/dist";
import { Networks, TransactionBuilder } from "@stellar/stellar-sdk";

export async function useCreateScholarship() {
  let called = false;

  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org/",
  });

  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<string | null>(null);
  const { address } = await kit.getAddress();

  const createScholarship = async (scholarship: Scholarship) => {
    if (called) return;
    // setLoading(true);
    // setError(null);

    scholarship.admin = address;
    scholarship.token =
      "CBPNR7NEAP322QVJ3MD3Q6WCLHPTREB2CCMF5U2SPVHILKAH42SFKMI5";

    try {
      called = true;

      //1. create transaction
      let transaction = await scholarshipContract.post_scholarship({
        scholarship,
      });

      //2. Get XDR
      const xdr = transaction.toXDR();

      //3. Sign transaction
      const signedXDR = await kit.signTransaction(xdr, {
        networkPassphrase: Networks.TESTNET,
      });

      //4. Convert signed tx back to transation
      const signedTx = TransactionBuilder.fromXDR(
        signedXDR.signedTxXdr,
        Networks.TESTNET
      );

      //5. Send transaction
      const server = new rpc.Server("https://soroban-testnet.stellar.org/");
      const result = await server.sendTransaction(signedTx);

      console.log(result);
    } catch (err: any) {
      console.log(err?.message);
      //   setError(err?.message);
    } finally {
      //   setLoading(false);
    }
  };

  return { createScholarship };
}
