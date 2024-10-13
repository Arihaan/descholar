"use client";
import { Client, networks, Scholarship } from "bindings";
import React from "react";
import { kit } from "../stellar-wallets-kit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import Navbar from '../components/Navbar';


const createScholarshipPage = () => {
  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org/",
  });

  const [scholarship, setScholarship] = React.useState<Scholarship>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // handle change logic here
  }

  async function submitScholarship() {
    const { address } = await kit.getAddress();

    if (!address) {
      alert("Please connect your wallet first");
      return;
    } else {
      if (scholarship) {
        scholarshipContract.post_scholarship({ scholarship });
      } else {
        alert("Scholarship details are incomplete.");
      }
    }

    try {
      if (scholarship) {
        const { signedTxXdr } = await kit.signTransaction(
          scholarship.toString(),
          {
            address,
            networkPassphrase: WalletNetwork.PUBLIC,
          }
        );
      } else {
        throw new Error("Scholarship details are incomplete.");
      }
    } catch (e) {
      console.error(e);
    }

    return (
      <>
      <Navbar />
        <div className="flex justify-center items-start mt-32">
          <h2 className="font-extrabold text-5xl">Create new Stellarship</h2>
        </div>
        <div className="flex justify-center items-start mt-12">
          <div className="card bg-primary text-neutral-content max-w-lg">
            <div className="card-body items-center text-center">
              <form
                className="place-content-center "
                onSubmit={(e) => {
                  e.preventDefault();
                  submitScholarship();
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-full max-w-xs m-2"
                  value={scholarship?.name}
                />

                <input
                  type="text"
                  placeholder="Details"
                  className="input input-bordered w-full max-w-xs m-2"
                  value={scholarship?.details}
                />

                <input
                  type="text"
                  placeholder="Available Grants"
                  className="input input-bordered w-full max-w-xs m-2"
                  value={scholarship?.available_grants.toString()}
                />

                <input
                  type="text"
                  placeholder="Total Grant Amount $"
                  className="input input-bordered w-full max-w-xs m-2"
                  value={scholarship?.total_grant_amount.toString()}
                />

                <input
                  type="date"
                  placeholder="End Date"
                  className="input input-bordered w-full max-w-xs m-2"
                  value={scholarship?.end_date.toString()}
                />

                <button type="submit" onClick={submitScholarship}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default createScholarshipPage;