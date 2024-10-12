"use client";
import React, { useEffect, useState } from "react";
import { Client, networks, Scholarship } from "bindings";
import { isConnected, getAddress } from "@stellar/freighter-api";
import { kit, loadedPublicKey } from "../stellar-wallets-kit";
import { scValToNative } from "stellar-sdk";

const scholarships = () => {
  //contract id is smart wallet address

  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org/",
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const transaction = await scholarshipContract.get_all_scholarships();
        console.log("transaction:", transaction);
        console.log(scValToNative(transaction.simulation.result.retval));
        //scValToNative(transaction.simulationResult.retval);
        //const { result } = await transaction.signAndSend({
        //   signTransaction: async (xdr) => {
        //     const { signedTxXdr } = await kit.signTransaction(xdr);
        //     console.log("signedTxXdr:", signedTxXdr);
        //     setScholarships(transaction.result);

        //  return signedTxXdr;
        //  },
        //});
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        throw error;
      }
    };

    fetchScholarships();
  }, []);

  return (
    <>
      <div className="flex justify-center items-start">
        <h1 className="m-12 font-extrabold text-5xl">Stellarships</h1>
      </div>
      <br />

      <div className="overflow-x-auto flex justify-center items-start h-screen">
        <table className="bg-primary-content table max-w-xl">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Amount</th>
              <th>DeadLine</th>
            </tr>
          </thead>
          <tbody>
            {scholarships?.map((_scholarship) => (
              <tr>
                <>
                  <th></th>
                  <th>{_scholarship.name}</th>
                  <td>{_scholarship.total_amount}$</td>
                  <td>{_scholarship.end_date}</td>
                  <td>
                    <button className="btn btn-accent btn-sm">apply</button>
                  </td>
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default scholarships;
