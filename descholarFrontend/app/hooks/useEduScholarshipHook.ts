import { useState } from "react";
import Web3 from "web3";
import contractAbi from "../../../contracts/edu/out/descholar.sol/descholar.json";

const contractAddress = "0x985fe4138c1f522503c93b3ea249c27aec85cab7"; //*public contract address
const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org"); //*public free testnet endpoint

const getContract = () => {
  return new web3.eth.Contract(contractAbi.abi, contractAddress);
};

export const eduScholarships = () => {
  const [scholarships, setScholarships] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getScholarships = async () => {
    setLoading(true);

    try {
      const contract = getContract();
      const scholarships = await contract.methods.get_schoolarships().call();
      console.log("Scholarships: ", scholarships);
      setScholarships(scholarships);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to load scholarships. Please try again later.");
      setLoading(false);
    }
    setLoading(false);
  };

  const postScholarship = async (scholarship: {
    name: string;
    details: string;
    available_grants: number;
    grant_amount: number;
    end_date: string;
  }) => {
    setLoading(true);
    try {
      // await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];
      const contract = getContract();

      const response = await contract.methods
        .post_scholarship(
          scholarship.name,
          scholarship.details,
          scholarship.available_grants,
          scholarship.grant_amount,
          scholarship.end_date,
          account,
          "0x0000000"
        )
        .send({ from: account, value: web3.utils.toWei("0.1", "ether") });
      console.log("Response: ", response);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to post scholarship. Please try again later.");
      setLoading(false);
    }
    setLoading(false);
  };

  return [scholarships, getScholarships, postScholarship, loading, error];
};
