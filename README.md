# Descholar - Decentralized Scholarships on EDU Chain

### Empowering education through decentralized scholarships on EDU Chain.

## Overview

Descholar is an innovative decentralized application (dApp) built on EDU Chain, designed to transform the way scholarships are created, managed, and distributed globally. By leveraging blockchain technology, Descholar offers a transparent, decentralized solution for scholarship distribution, particularly targeting students in underserved regions. The platform enables organizations to create scholarships, while students can apply seamlessly, ensuring equal access to educational funding on a global scale.

---

## Team

### Arihaan

- **Role**: Full-stack Developer
- **Achievements**: Winner at Chainlink and zkSync hackathons
- **Experience**: Previously interned at IBM and Deloitte
- **Education**: Student at University of Hertfordshire

### Filip

- **Role**: Full-stack Developer
- **Achievements**: Winner at ETHBratislava
- **Experience**: .Net FullStack dev
- **Education**: Student at Slovak University of Technology - FIIT

## Key Features

- **Decentralized Scholarship Creation**: Organizations can create scholarships by providing essential details like the scholarship name, description, total grant amount, number of grants, and application deadline.
- **Student Application Process**: Students worldwide can apply for scholarships by submitting their personal details and application form through a simple and intuitive interface.
- **Blockchain Transparency**: Funds for the scholarships are securely managed on EDU Chain via smart contracts, ensuring that all transactions are verifiable and immutable.
- **Automatic Grant Distribution**: Once the scholarship creator approves a student's application, the smart contract automatically distributes the grant amount in EDU tokens.
- **Scholarship Management**: Creators can cancel scholarships with a reason and get remaining funds back, or withdraw remaining funds after expiry.
- **Multiple Application Prevention**: Smart contract ensures each student can only apply once to each scholarship.
- **Status Tracking**: Clear status indicators for applications and scholarships, including cancellation reasons and timestamps.

---

## How It Works

1. **Create a Scholarship**:

   - An organization or donor creates a new scholarship by entering key details, such as the scholarship name, description, grant amount per student, number of available grants, and end date.
   - The organization must deposit the total grant amount (grant amount × number of grants) into the smart contract.

2. **View Available Scholarships**:

   - Users can browse all active scholarships, with clear indicators of remaining grants and end dates.

3. **Apply for a Scholarship**:

   - Students can apply for scholarships by providing their details. The smart contract ensures each student can only apply once per scholarship.

4. **Application Review**:

   - Scholarship creators can review applications and approve deserving students.
   - Applications for cancelled scholarships cannot be approved.

5. **Grant Distribution**:

   - Upon approval, the smart contract automatically transfers the grant amount to the student's wallet.
   - The number of remaining grants decreases accordingly.

6. **Scholarship Management**:
   - Creators can cancel scholarships by providing a reason, receiving back remaining funds
   - After expiry, creators can withdraw any remaining grant funds
   - All actions are transparent and recorded on the blockchain

---

## Tech Stack

Descholar is built using modern web3 technologies:

- **Smart Contracts**: Solidity smart contracts on EDU Chain for secure and transparent scholarship management
- **Next.js**: React framework for the frontend interface
- **Ethers.js**: For blockchain interactions
- **TailwindCSS**: For responsive and modern UI design
- **Framer Motion**: For smooth animations and transitions
- **TypeScript**: For type-safe development

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arihaan/descholar.git
   ```
2. **Navigate to the frontend directory**
   ```bash
   cd descholarFrontend
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```

## Contract Information

- **Contract Address**: `0x7820AB9a78FEb626b9CA0A06331aF8e200d69bF2`
- **Network**: EDU Chain Testnet

---

## Security Features

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Access Control**: Clear ownership and permission management
- **Input Validation**: Thorough checks for all user inputs
- **Safe Fund Management**: Secure handling of scholarship funds

---

## Contract Repository

All Solidity smart contracts for Descholar have been migrated to a separate repository:
[descholarContracts](https://github.com/f1l1ph/descholarContracts)

---
