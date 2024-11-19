"use client";
import React, { useState } from "react";
import { kit } from "../stellar-wallets-kit";
import { motion } from "framer-motion";
import Client from "bindings";

const CreateScholarshipPage = () => {
  const [scholarship, setScholarship] = useState({
    name: "",
    details: "",
    available_grants: 0,
    total_grant_amount: 0,
    end_date: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setScholarship((prev) => ({
      ...prev,
      [name]:
        name === "available_grants" || name === "total_grant_amount"
          ? parseInt(value)
          : value,
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

      alert("Scholarship created successfully!");
      location.reload();
    } catch (error) {
      console.error("Error creating scholarship:", error);
      alert("Error creating scholarship. Please try again.");
      location.reload();
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-no-repeat w-full"
        style={{
          backgroundImage: 'url("/resources/webpagebg.png")',
          backgroundSize: "100% auto",
          backgroundColor: "#10081e",
          backgroundPosition: "top center",
          maxWidth: "100vw",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(16, 8, 30, 0) 0%, rgba(16, 8, 30, 0.8) 50%, rgba(16, 8, 30, 1) 100%)",
            pointerEvents: "none",
          }}
        ></div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-8 text-center text-white">
            Create Scholarship
          </h1>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Create a new scholarship opportunity and make a difference in
            students' lives. All scholarships are secured by Soroban smart
            contracts on the Stellar blockchain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-700"
        >
          <form onSubmit={submitScholarship} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2 text-sm">
                Scholarship Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={scholarship.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-white mb-2 text-sm"
              >
                Details
              </label>
              <input
                type="text"
                id="details"
                name="details"
                value={scholarship.details}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="available_grants"
                className="block text-white mb-2 text-sm"
              >
                Available Grants
              </label>
              <input
                type="number"
                id="available_grants"
                name="available_grants"
                value={scholarship.available_grants}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="total_grant_amount"
                className="block text-white mb-2 text-sm"
              >
                Total Grant Amount (XLM)
              </label>
              <input
                type="number"
                id="total_grant_amount"
                name="total_grant_amount"
                value={scholarship.total_grant_amount}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-white mb-2 text-sm"
              >
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={scholarship.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Scholarship
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateScholarshipPage;
