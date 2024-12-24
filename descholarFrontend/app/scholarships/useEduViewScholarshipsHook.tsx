// import { useState } from "react";
// import Web3 from "web3";
// //import contractAbi from "../../../contracts/edu/out/descholar.sol/descholar.json";

// const web3 = new Web3("https://open-campus-codex-sepolia.drpc.org"); //*public free testnet endpoint

// const getContract = () => {
//   const contractAddress = "0x985fe4138c1f522503c93b3ea249c27aec85cab7"; //*public contract address
//   return new web3.eth.Contract(contractAbi.abi, contractAddress);
// };

// export const eduViewScholarships = () => {
//   const [scholarships, setScholarships] = useState<any>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getScholarshipsEDU = async () => {
//     setLoading(true);

//     try {
//       const contract = getContract();
//       const scholarships = await contract.methods.get_schoolarships().call();
//       console.log("Scholarships: ", scholarships);
//       setScholarships(scholarships);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setError("Failed to load scholarships. Please try again later.");
//       setLoading(false);
//     }
//     setLoading(false);
//   };

//   return [scholarships, getScholarshipsEDU, loading, error];
// };
