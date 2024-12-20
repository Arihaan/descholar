"use client";
import React, { useState } from "react";
import { kit } from "../stellar-wallets-kit";
import { motion } from "framer-motion";
import ScholarshipConfirmation from "../components/ScholarshipConfirmation";
import { Scholarship } from "../../bindings/dist";
import { useCreateScholarship } from "../hooks/useCreateScholarshipHook";
import { useEffect } from "react";

const CreateScholarshipPage = () => {
  const [scholarship, setScholarship] = useState({
    name: "",
    details: "",
    available_grants: 0,
    grant_amount: 0,
    end_date: "",
  });

  const [doEffect, setDoEffect] = useState(false);
  useEffect(() => {
    if (!doEffect) return;
    setDoEffect(false);

    const fetchData = async () => {
      const fetchWalletAddress = async () => {
        try {
          const { address } = await kit.getAddress();
          if (address) {
            setWalletAddress(address);
          }
        } catch (error) {
          console.error("Error getting wallet address:", error);
        }
      };

      const createScholarshipAsync = async () => {
        const { createScholarship } = await useCreateScholarship();
        let newScholarship: Scholarship = {
          admin: walletAddress.toString(),
          available_grants: BigInt(scholarship.available_grants),
          details: scholarship.details,
          end_date: BigInt(
            isNaN(new Date(scholarship.end_date).getTime())
              ? 0
              : new Date(scholarship.end_date).getTime()
          ),
          id: BigInt(0),
          name: scholarship.name,
          student_grant_amount: BigInt(scholarship.grant_amount),
          token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
        };
        // createScholarship(newScholarship);
      };

      await fetchWalletAddress();
      await createScholarshipAsync();
    };

    fetchData();
  }, [doEffect]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setScholarship((prev) => ({
      ...prev,
      [name]:
        name === "available_grants" || name === "grant_amount"
          ? value === ""
            ? 0
            : Math.max(1, parseInt(value.replace(/^0+/, "")))
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!scholarship.name.trim()) {
      alert("Please enter a scholarship name");
      return;
    }

    if (!scholarship.details.trim()) {
      alert("Please enter scholarship details");
      return;
    }

    if (scholarship.available_grants <= 0) {
      alert("Number of available grants must be greater than 0");
      return;
    }

    if (scholarship.grant_amount <= 0) {
      alert("Grant amount must be greater than 0");
      return;
    }

    const endDate = new Date(scholarship.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate < today) {
      alert("End date cannot be in the past");
      return;
    }

    try {
      const { address } = await kit.getAddress();
      if (!address) {
        alert("Please connect your wallet first");
        return;
      }
      setWalletAddress(address);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error getting wallet address:", error);
      alert("Please connect your wallet first");
    }
  }

  async function handleConfirmCreate() {
    if (doEffect) return;
    try {
      const total_grant_amount =
        scholarship.grant_amount * scholarship.available_grants;
      const scholarshipData = {
        ...scholarship,
        total_grant_amount,
        admin: walletAddress,
      };

      // TODO: Implement contract interaction here
      // setDoEffect(true);
      //close the popup
      // ! scholarship is being created here

      alert("Scholarship created successfully!");
      location.reload();
    } catch (error) {
      console.error("Error creating scholarship:", error);
      alert("Error creating scholarship. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative">
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
            students' lives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-gray-900 bg-opacity-40 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2 text-sm">
                Scholarship Name *
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
                Details *
              </label>
              <textarea
                id="details"
                name="details"
                value={scholarship.details}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm resize-y"
                required
              />
            </div>

            <div>
              <label
                htmlFor="available_grants"
                className="block text-white mb-2 text-sm"
              >
                Available Grants *
              </label>
              <input
                type="number"
                id="available_grants"
                name="available_grants"
                value={scholarship.available_grants || ""}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="grant_amount" className="block text-white mb-2 text-sm">
                Grant Amount per Student (EDU) *
              </label>
              <input
                type="number"
                id="grant_amount"
                name="grant_amount"
                value={scholarship.grant_amount || ""}
                onChange={handleChange}
                min="1"
                step="1"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-white mb-2 text-sm"
              >
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={scholarship.end_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
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

      <ScholarshipConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmCreate}
        scholarship={scholarship}
        walletAddress={walletAddress}
      />
    </div>
  );
};

export default CreateScholarshipPage;
