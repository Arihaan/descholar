"use client";
import { Client, networks, Scholarship } from "bindings";
import React, { useState } from "react";
import { kit } from "../stellar-wallets-kit";
import { WalletNetwork } from "@creit.tech/stellar-wallets-kit";
import Navbar from '../components/Navbar';

const CreateScholarshipPage = () => {
  const scholarshipContract = new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org/",
  });

  const [scholarship, setScholarship] = useState({
    name: "",
    details: "",
    available_grants: 0,
    total_grant_amount: 0,
    end_date: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setScholarship(prev => ({
      ...prev,
      [name]: name === 'available_grants' || name === 'total_grant_amount' ? parseInt(value) : value,
    }));
  }

  async function submitScholarship(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { address } = await kit.getAddress();

      if (!address) {
        alert("Please connect your wallet first");
        return;
      }

      // Convert end_date to Unix timestamp
      const endDate = Math.floor(new Date(scholarship.end_date).getTime() / 1000);

      const scholarshipToSubmit: Scholarship = {
        name: scholarship.name,
        details: scholarship.details,
        available_grants: scholarship.available_grants,
        total_grant_amount: BigInt(Math.round(scholarship.total_grant_amount * 10_000_000)),
        end_date: BigInt(endDate),
      };

      const transaction = await scholarshipContract.post_scholarship({ scholarship: scholarshipToSubmit });
      const { signedTxXdr } = await kit.signTransaction(transaction.toXDR(), {
        networkPassphrase: WalletNetwork.TESTNET,
      });

      const result = await scholarshipContract.post_scholarship({
        scholarship: scholarshipToSubmit,
      }, { signedTxXdr });

      console.log("Scholarship created:", result);
      alert("Scholarship created successfully!");
    } catch (error) {
      console.error("Error creating scholarship:", error);
      alert("Error creating scholarship. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Create New Stellarship</h1>
        <div className="max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-3xl shadow-lg">
          <form onSubmit={submitScholarship}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-blue-300 mb-2">Scholarship Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={scholarship.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="details" className="block text-blue-300 mb-2">Details</label>
              <input
                type="text"
                id="details"
                name="details"
                value={scholarship.details}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="available_grants" className="block text-blue-300 mb-2">Available Grants</label>
              <input
                type="number"
                id="available_grants"
                name="available_grants"
                value={scholarship.available_grants}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="total_grant_amount" className="block text-blue-300 mb-2">Total Grant Amount (XLM)</label>
              <input
                type="number"
                id="total_grant_amount"
                name="total_grant_amount"
                value={scholarship.total_grant_amount}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="end_date" className="block text-blue-300 mb-2">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={scholarship.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg rounded-xl w-full">
              Create Scholarship
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateScholarshipPage;
