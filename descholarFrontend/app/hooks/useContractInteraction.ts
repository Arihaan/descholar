import { ethers, Contract as EthersContract } from 'ethers';
import { useEffect, useState } from 'react';
import { Scholarship } from '../types/scholarship';

const CONTRACT_ADDRESS = '0x653bf4b959101e008A3251A960C46e8C6c1138B3';
const CONTRACT_ABI = [
    // Events
    "event ScholarshipCreated(uint256 indexed scholarshipId, address indexed creator, uint256 totalAmount)",
    "event ApplicationSubmitted(uint256 indexed scholarshipId, uint256 indexed applicationId, address applicant)",
    "event ApplicationStatusChanged(uint256 indexed applicationId, uint8 status)",
    "event GrantAwarded(uint256 indexed scholarshipId, address indexed recipient, uint256 amount)",
    "event ScholarshipCancelled(uint256 indexed scholarshipId, string reason, uint256 refundAmount)",
    "event ScholarshipWithdrawn(uint256 indexed scholarshipId, uint256 refundAmount)",
    
    // View Functions
    "function getScholarships() external view returns (tuple(uint256 id, string name, string details, uint256 grantAmount, uint256 remainingGrants, uint256 totalGrants, uint256 endDate, address creator, bool active, uint256 createdAt, bool isCancelled, string cancellationReason, uint256 cancelledAt, address tokenId)[] memory)",
    "function getUserApplications(address user) external view returns (tuple(uint256 id, uint256 scholarshipId, address applicant, string name, string details, uint8 status, uint256 appliedAt)[] memory)",
    
    // State Changing Functions
    "function postScholarship(string calldata name, string calldata details, uint256 grantAmount, uint256 numberOfGrants, uint256 endDate, address tokenId) external payable",
    "function applyForScholarship(uint256 scholarshipId, string calldata name, string calldata details) external",
    "function approveApplication(uint256 scholarshipId, uint256 applicationId) external",
    "function cancelScholarship(uint256 scholarshipId, string calldata reason) external",
    "function withdrawExpiredScholarship(uint256 scholarshipId) external",
    "function getApplicationsForScholarship(uint256 scholarshipId) external view returns (tuple(uint256 id, uint256 scholarshipId, address applicant, string name, string details, uint8 status, uint256 appliedAt)[] memory)",
    "function hasApplied(uint256 scholarshipId, address user) external view returns (bool)"
];

// Define a type that includes both read-only and connected contracts
type Contract = ethers.Contract;

export const useContractInteraction = () => {
    const [contract, setContract] = useState<Contract | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initContract = async () => {
            try {
                console.log('Initializing contract...');
                // Create a read-only provider without requiring wallet connection
                const provider = new ethers.JsonRpcProvider("https://open-campus-codex-sepolia.drpc.org");
                
                // Create read-only contract instance
                const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                setContract(readOnlyContract);

                // If wallet is connected, add signer
                if (typeof window !== 'undefined' && window.ethereum) {
                    const walletProvider = new ethers.BrowserProvider(window.ethereum);
                    try {
                        const network = await walletProvider.getNetwork();
                        
                        if (network.chainId === BigInt(656476)) {
                            const walletSigner = await walletProvider.getSigner();
                            setSigner(walletSigner);
                            
                            // Create contract instance with signer for write operations
                            const contractWithSigner = new ethers.Contract(
                                CONTRACT_ADDRESS,
                                CONTRACT_ABI,
                                walletSigner
                            );
                            setContract(contractWithSigner);
                        }
                    } catch (error) {
                        console.error('Error getting signer:', error);
                        // Still set initialized to true if we have read-only access
                    }
                }
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing contract:', error);
                // Still set initialized to true if we have read-only access
                setIsInitialized(true);
            }
        };

        initContract();
    }, []);

    const getScholarships = async () => {
        if (!contract) {
            console.log('Contract not initialized');
            return [];
        }
        try {
            console.log('Fetching scholarships...');
            const result = await contract.getScholarships();
            console.log('Raw scholarships data:', result);

            // Create a cache for token decimals
            const tokenDecimalsCache: { [key: string]: number } = {};

            // The result is an array where each element is an array of values
            const scholarships = Array.isArray(result) ? result : [result];
            
            const formattedScholarships = await Promise.all(scholarships.map(async (scholarship: any) => {
                console.log('Processing scholarship:', scholarship);
                
                let formattedAmount = scholarship[3]; // Default to raw amount
                let tokenSymbol = 'EDU';

                if (scholarship[13] !== ethers.ZeroAddress) {
                    try {
                        // Get token decimals if not cached
                        if (!tokenDecimalsCache[scholarship[13]]) {
                            const tokenContract = new ethers.Contract(
                                scholarship[13],
                                ["function decimals() view returns (uint8)", "function symbol() view returns (string)"],
                                contract.runner
                            );
                            const decimals = await tokenContract.decimals();
                            const symbol = await tokenContract.symbol();
                            tokenDecimalsCache[scholarship[13]] = decimals;
                            tokenSymbol = symbol;
                        }
                        
                        // Format amount using correct decimals
                        formattedAmount = ethers.formatUnits(scholarship[3], tokenDecimalsCache[scholarship[13]]);
                    } catch (error) {
                        console.error('Error getting token info:', error);
                        tokenSymbol = 'ERC20';
                    }
                } else {
                    formattedAmount = ethers.formatEther(scholarship[3]);
                }

                return {
                    id: Number(scholarship[0]),
                    name: scholarship[1],
                    details: scholarship[2],
                    grantAmount: formattedAmount,
                    remainingGrants: Number(scholarship[4]),
                    totalGrants: Number(scholarship[5]),
                    endDate: new Date(Number(scholarship[6]) * 1000),
                    creator: scholarship[7],
                    creatorUrl: `https://edu-chain-testnet.blockscout.com/address/${scholarship[7]}`,
                    active: scholarship[8],
                    createdAt: new Date(Number(scholarship[9]) * 1000),
                    isCancelled: scholarship[10],
                    cancellationReason: scholarship[11],
                    cancelledAt: scholarship[12] > 0 ? new Date(Number(scholarship[12]) * 1000) : null,
                    tokenId: scholarship[13],
                    tokenUrl: scholarship[13] !== ethers.ZeroAddress ? 
                        `https://edu-chain-testnet.blockscout.com/token/${scholarship[13]}` : undefined,
                    tokenSymbol: tokenSymbol
                };
            }));
            
            console.log('Formatted scholarships:', formattedScholarships);
            return formattedScholarships as Scholarship[];
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            return [] as Scholarship[];
        }
    };

    const createScholarship = async (
        name: string,
        details: string,
        grantAmount: string,
        numberOfGrants: number,
        endDate: Date,
        tokenId: string = ethers.ZeroAddress
    ) => {
        if (!contract) {
            throw new Error('Contract not initialized');
        }
        if (!signer) {
            throw new Error('Please connect your wallet');
        }

        // Basic validation
        if (numberOfGrants <= 0) {
            throw new Error('Number of grants must be greater than 0');
        }
        if (parseFloat(grantAmount) <= 0) {
            throw new Error('Grant amount must be greater than 0');
        }
        
        try {
            const unixEndDate = Math.floor(endDate.getTime() / 1000);

            if (tokenId === ethers.ZeroAddress) {
                // Native token payment
                const grantAmountWei = ethers.parseEther(grantAmount);
                const totalAmount = grantAmountWei * BigInt(numberOfGrants);

                const tx = await contract.postScholarship(
                    name,
                    details,
                    grantAmountWei,
                    numberOfGrants,
                    unixEndDate,
                    tokenId,
                    { value: totalAmount }
                );
                const receipt = await tx.wait();
                return {
                    hash: tx.hash,
                    url: `https://edu-chain-testnet.blockscout.com/tx/${tx.hash}`
                };
            } else {
                // ERC20 token payment
                const erc20Contract = new ethers.Contract(
                    tokenId,
                    [
                        "function approve(address spender, uint256 amount) external returns (bool)",
                        "function decimals() view returns (uint8)",
                        "function symbol() view returns (string)"
                    ],
                    signer
                );
                
                const decimals = await erc20Contract.decimals();
                const grantAmountInTokenDecimals = ethers.parseUnits(grantAmount, decimals);
                const totalAmount = grantAmountInTokenDecimals * BigInt(numberOfGrants);

                // Approve contract to spend tokens
                const approveTx = await erc20Contract.approve(CONTRACT_ADDRESS, totalAmount);
                await approveTx.wait();

                // Create scholarship
                const tx = await contract.postScholarship(
                    name,
                    details,
                    grantAmountInTokenDecimals,
                    numberOfGrants,
                    unixEndDate,
                    tokenId
                );
                const receipt = await tx.wait();
                return {
                    hash: tx.hash,
                    url: `https://edu-chain-testnet.blockscout.com/tx/${tx.hash}`
                };
            }
        } catch (error) {
            console.error('Error creating scholarship:', error);
            throw error;
        }
    };

    const getUserActivity = async (address: string) => {
        if (!contract) return { applications: [], scholarships: [] };
        try {
            // Create a cache for token decimals and symbols
            const tokenCache: { [key: string]: { decimals: number; symbol: string } } = {};

            // Get user applications
            const applications = await contract.getUserApplications(address);
            
            // Get all scholarships to match with applications
            const allScholarships = await contract.getScholarships();
            
            // Create a map of scholarships by ID for quick lookup
            const scholarshipMap = new Map();
            
            // Process scholarships with correct token decimals
            for (const scholarship of allScholarships) {
                let formattedAmount = scholarship[3];
                let tokenSymbol = 'EDU';
                
                if (scholarship[13] !== ethers.ZeroAddress) {
                    try {
                        if (!tokenCache[scholarship[13]]) {
                            const tokenContract = new ethers.Contract(
                                scholarship[13],
                                [
                                    "function decimals() view returns (uint8)",
                                    "function symbol() view returns (string)"
                                ],
                                contract.runner
                            );
                            const decimals = await tokenContract.decimals();
                            const symbol = await tokenContract.symbol();
                            tokenCache[scholarship[13]] = { decimals, symbol };
                        }
                        formattedAmount = ethers.formatUnits(
                            scholarship[3],
                            tokenCache[scholarship[13]].decimals
                        );
                        tokenSymbol = tokenCache[scholarship[13]].symbol;
                    } catch (error) {
                        console.error('Error getting token info:', error);
                        tokenSymbol = 'ERC20';
                    }
                } else {
                    formattedAmount = ethers.formatEther(scholarship[3]);
                }

                scholarshipMap.set(Number(scholarship[0]), {
                    id: Number(scholarship[0]),
                    name: scholarship[1],
                    details: scholarship[2],
                    grantAmount: formattedAmount,
                    remainingGrants: Number(scholarship[4]),
                    totalGrants: Number(scholarship[5]),
                    endDate: new Date(Number(scholarship[6]) * 1000),
                    creator: scholarship[7],
                    creatorUrl: `https://edu-chain-testnet.blockscout.com/address/${scholarship[7]}`,
                    active: scholarship[8],
                    createdAt: new Date(Number(scholarship[9]) * 1000),
                    isCancelled: scholarship[10],
                    cancellationReason: scholarship[11],
                    cancelledAt: scholarship[12] > 0 ? new Date(Number(scholarship[12]) * 1000) : null,
                    tokenId: scholarship[13],
                    tokenUrl: scholarship[13] !== ethers.ZeroAddress ? 
                        `https://edu-chain-testnet.blockscout.com/token/${scholarship[13]}` : undefined,
                    tokenSymbol: tokenSymbol
                });
            }

            // Format applications with scholarship data
            const formattedApplications = applications.map((app: any) => ({
                id: Number(app[0]),
                scholarshipId: Number(app[1]),
                applicant: app[2],
                name: app[3],
                details: app[4],
                status: Number(app[5]),
                appliedAt: new Date(Number(app[6]) * 1000),
                scholarship: scholarshipMap.get(Number(app[1]))
            }));

            // Get user's created scholarships
            const createdScholarships = Array.from(scholarshipMap.values())
                .filter((s: any) => s.creator.toLowerCase() === address.toLowerCase());

            return {
                applications: formattedApplications,
                scholarships: createdScholarships
            };
        } catch (error) {
            console.error('Error fetching user activity:', error);
            return { applications: [], scholarships: [] };
        }
    };

    const applyForScholarship = async (
        scholarshipId: number,
        name: string,
        details: string
    ) => {
        if (!contract || !signer) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.applyForScholarship(
                scholarshipId,
                name,
                details
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error applying for scholarship:', error);
            throw error;
        }
    };

    const getApplicationsForScholarship = async (scholarshipId: number) => {
        if (!contract) {
            console.log('Contract not initialized');
            return [];
        }
        try {
            console.log('Fetching applications for scholarship:', scholarshipId);
            const result = await contract.getApplicationsForScholarship(scholarshipId);
            
            // Add type annotation for app parameter
            console.log('Raw applications data:', result.map((app: any[]) => ({
                id: Number(app[0]),
                scholarshipId: Number(app[1]),
                applicant: app[2],
                name: app[3],
                details: app[4],
                status: Number(app[5]),
                appliedAt: Number(app[6])
            })));
            
            const formattedApplications = result.map((app: any) => {
                // Direct access to array indices, converting BigInt to Number where needed
                return {
                    id: Number(app[0]),
                    scholarshipId: Number(app[1]),
                    applicant: app[2],
                    name: app[3],
                    details: app[4],
                    status: ['Applied', 'Approved', 'Rejected'][Number(app[5])],
                    appliedAt: new Date(Number(app[6]) * 1000)
                };
            });
            
            console.log('Formatted applications:', formattedApplications);
            return formattedApplications;
        } catch (error) {
            console.error('Error fetching scholarship applications:', error);
            console.log('Contract address:', CONTRACT_ADDRESS);
            console.log('Scholarship ID:', scholarshipId);
            return [];
        }
    };

    const approveApplication = async (scholarshipId: number, applicationId: number) => {
        if (!contract || !signer) throw new Error('Contract not initialized');
        
        try {
            console.log('Approving application:', applicationId, 'for scholarship:', scholarshipId);
            const tx = await contract.approveApplication(scholarshipId, applicationId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error approving application:', error);
            throw error;
        }
    };

    const cancelScholarship = async (scholarshipId: number, reason: string) => {
        if (!contract || !signer) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.cancelScholarship(scholarshipId, reason);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error cancelling scholarship:', error);
            throw error;
        }
    };

    const withdrawExpiredScholarship = async (scholarshipId: number) => {
        if (!contract || !signer) throw new Error('Contract not initialized');
        
        try {
            const tx = await contract.withdrawExpiredScholarship(scholarshipId);
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error withdrawing expired scholarship:', error);
            throw error;
        }
    };

    const checkHasApplied = async (scholarshipId: number, address: string) => {
        if (!contract) return false;
        try {
            return await contract.hasApplied(scholarshipId, address);
        } catch (error) {
            console.error('Error checking application status:', error);
            return false;
        }
    };

    return {
        getScholarships,
        createScholarship,
        getUserActivity,
        applyForScholarship,
        getApplicationsForScholarship,
        approveApplication,
        cancelScholarship,
        withdrawExpiredScholarship,
        checkHasApplied,
        isInitialized
    };
}; 