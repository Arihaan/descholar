"use client";
//import React, { useEffect, useState } from "react";
//import { Client, networks, Scholarship } from "bindings";
//import { scValToNative } from "stellar-sdk";
import Navbar from "../components/Navbar";

const Scholarships = () => {
  // const scholarshipContract = new Client({
  //   contractId: networks.testnet.contractId,
  //   networkPassphrase: networks.testnet.networkPassphrase,
  //   rpcUrl: "https://soroban-testnet.stellar.org/",
  // });

  // const [scholarships, setScholarships] = useState<Scholarship[]>();

  // useEffect(() => {
  //   const fetchScholarships = async () => {
  //     try {
  //       const transaction = await scholarshipContract.get_scholarships();
  //       console.log("transaction:", transaction);
  //       if (transaction.simulation?.result?.retval) {
  //         console.log(scValToNative(transaction.simulation.result.retval));
  //         var result = scValToNative(transaction.simulation.result.retval);
  //         setScholarships(result);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching scholarships:", error);
  //     }
  //   };

  //   fetchScholarships();
  // }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
          Available Scholarships
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*scholarships?.map((_scholarship, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-50 p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                {_scholarship.name}
              </h2>
              <p className="text-gray-300 mb-2">
                Amount: {Number(_scholarship.total_grant_amount) / 10_000_000}{" "}
                XLM
              </p>
              <p className="text-gray-300 mb-2">
                Deadline:{" "}
                {new Date(
                  Number(_scholarship.end_date) * 1000
                ).toLocaleDateString()}
              </p>
              <p className="text-gray-300 mb-4">
                Available Grants: {_scholarship.available_grants}
              </p>
              <button className="btn btn-accent btn-sm rounded-xl w-full">
                Apply
              </button>
            </div>
          ))*/}
        </div>
      </main>
    </div>
  );
};

export default Scholarships;
