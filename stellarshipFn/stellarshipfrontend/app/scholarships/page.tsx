import React, { useEffect, useState } from "react";
import { Client, networks, Scholarship } from "bindings";
import { isConnected, getAddress } from "@stellar/freighter-api";

const scholarships = () => {
  //contract id is smart wallet address

  let addressLookup = (async () => {
    if (await isConnected()) return getAddress();
  })();

  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://rpc-testnet.stellar.org/",
  });

  const [scholarships, setScholarships] = useState<Scholarship[]>();

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const transaction = await scholarshipContract.get_all_scholarships();
        setScholarships(transaction.result);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
        throw error;
      }
    };

    fetchScholarships();
  }, []);

  /*  {
      id: 1,
      name: "Academic Excellence Scholarship",
      amount: 20000,
      deadline: "2024-12-31",
      description:
        "A scholarship for high school seniors based on academic excellence, leadership, and service.",
      quantity: 10,
    },
    {
      id: 2,
      name: "Low-Income Student Scholarship",
      amount: 40000,
      deadline: "2025-01-15",
      description:
        "A scholarship for low-income students pursuing undergraduate studies.",
      quantity: 20,
    },
    {
      id: 3,
      name: "STEM Graduate Scholarship",
      amount: 30000,
      deadline: "2025-02-28",
      description: "A scholarship for graduate students in STEM fields.",
      quantity: 5,
    },*/

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
