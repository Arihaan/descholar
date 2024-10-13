# Stellarship - Decentralized Scholarship dApp on Stellar Soroban

### Empowering education through decentralized scholarships on Stellar.

## Overview
Stellarship is an innovative decentralized application (dApp) built on the Stellar Soroban blockchain, designed to transform the way scholarships are created, managed, and distributed globally. By leveraging blockchain technology, Stellarship offers a transparent, decentralized solution for scholarship distribution, particularly targeting students in underserved regions. The platform enables organizations to create scholarships, while students can apply seamlessly, ensuring equal access to educational funding on a global scale.

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
- **Education**: Student at Slovak Technical University


## Key Features

- **Decentralized Scholarship Creation**: Organizations can create scholarships by providing essential details like the scholarship name, description, total grant amount, number of grants, and application deadline.
- **Student Application Process**: Students worldwide can apply for scholarships by submitting their personal details and application form through a simple and intuitive interface.
- **Blockchain Transparency**: Funds for the scholarships are securely managed on the Stellar blockchain via smart contracts, ensuring that all transactions are verifiable and immutable.
- **Automatic Grant Distribution**: Once the scholarship creator approves a student’s application, the smart contract automatically distributes the grant amount in XLM (Stellar’s native currency), calculated by dividing the total grant amount by the number of available grants.
- **Global Reach via Stellar Anchors**: To ensure that students in disadvantaged regions can easily access their funds, Stellarship integrates with Stellar anchors, such as MoneyGram off-ramps, to allow recipients to withdraw their grants in local currencies.
- **Low Barrier of Entry**: Stellarship utilizes Stellar’s innovative passkey authentication to lower the entry barriers, simplifying access for students in technologically underserved areas by providing secure, easy login options without complex wallet setups.

---

## How It Works

1. **Create a Scholarship**: 
    - An organization or donor instantiates a new scholarship by entering key details, such as the scholarship name, a description of the program, the total grant amount in XLM, the number of available grants, and the scholarship's end date. 
    - The organization must deposit the total grant amount into the smart contract. The smart contract then securely holds the funds until they are distributed.
  
2. **View Available Scholarships**: 
    - Users can query the platform to view all available scholarships, which are fetched from the blockchain to display on the front end.

3. **Apply for a Scholarship**: 
    - A student interested in applying for a scholarship submits an application form by providing their personal details. Each student can only apply for a scholarship once, ensuring fairness.

4. **Application Review**:
    - The organization that created the scholarship can view all the applicants for that particular scholarship. The reviewing process allows the organization to evaluate applications and approve students who meet their criteria.

5. **Grant Distribution**: 
    - Once the organization approves a student, the smart contract automatically transfers the corresponding amount of XLM to the approved student’s wallet. The grant amount is calculated as the total grant amount divided by the number of grants. The number of available grants is reduced accordingly.

6. **Off-Ramp for Local Usage**: 
    - Through Stellar anchors like MoneyGram, students who receive grants in XLM can convert their funds into local currencies, enabling them to use the scholarship for local educational expenses.

---

## Problem Solved

- According to UNESCO, **244 million children and youth** between the ages of 6 and 18 are still out of school globally. In addition, **$100 million in scholarship money** goes unclaimed every year due to inefficient or inaccessible scholarship distribution systems.
- Stellarship aims to bridge this gap by providing a decentralized, transparent, and accessible platform that connects scholarship funds to students worldwide. By utilizing the power of blockchain, Stellarship ensures that the entire process, from scholarship creation to fund distribution, is trustless, efficient, and secure.

---

## Why Stellar Soroban?

Stellarship harnesses the unique capabilities of the Stellar blockchain and the Soroban smart contract platform to create a truly decentralized, global solution. Here's why Stellar is critical to Stellarship's success:

1. **Global Financial Inclusion**: Stellar's mission of financial inclusion aligns perfectly with Stellarship's goal of democratizing access to scholarships. Stellar’s network and partnerships, like its integration with MoneyGram, allow students to convert XLM into local currencies, breaking down financial barriers.
  
2. **Fast and Low-Cost Transactions**: Stellar’s blockchain is designed for fast, low-cost transactions, making it an ideal platform for efficiently distributing scholarship funds across borders. Students in underserved regions can receive scholarships without the heavy transaction fees associated with traditional banking.

3. **Smart Contracts on Soroban**: Using Soroban smart contracts, Stellarship automates key processes like fund management, application review, and grant distribution. Soroban allows us to build secure, programmable contracts that ensure scholarship funds are held and distributed according to predefined conditions, without intermediaries.

4. **Passkey Integration**: Stellar’s innovative passkey feature simplifies authentication, reducing friction for students from regions with low technological infrastructure. This improves user experience and ensures that the platform is accessible to a wider audience.

---

## Tech Stack

Stellarship is built using a combination of cutting-edge blockchain and web technologies to provide a seamless, secure, and efficient user experience:

- **Stellar Soroban**: Soroban is Stellar's smart contract platform that powers the core functionality of Stellarship, including scholarship creation, applicant management, and automated fund distribution.
  
- **Stellar SDK**: The Stellar SDK is used for interacting with the Stellar blockchain, allowing the dApp to read and write data to the ledger, such as fetching available scholarships and submitting transactions for fund distribution.

- **Stellar CLI**: Used for managing smart contract deployment and interacting with the blockchain network during the development process.

- **Stellar Anchors**: Stellarship integrates with Stellar's anchor system, such as MoneyGram, to provide off-ramping capabilities for grant recipients, enabling them to withdraw their funds in local currencies.

- **Next.js**: The front-end of the dApp is built using Next.js, a powerful React framework, to deliver a fast, responsive, and user-friendly interface for both organizations and students.

---

## Installation

Follow the steps below to set up and run Stellarship on your local machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/stellarship.git
2. **Navigate to the project directory**
   ```bash
   cd stellarship/stellarshipFn/stellarshipfrontend
3. **Install dependencies**
   ```bash
   npm install
4. **Start the development server**
   ```bash
   npm run dev
