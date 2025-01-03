import { ethers, Contract as EthersContract } from 'ethers';
import { useEffect, useState } from 'react';

const CONTRACT_ADDRESS = '0x7820AB9a78FEb626b9CA0A06331aF8e200d69bF2';
const CONTRACT_ABI = [
    // Events
    "event ScholarshipCreated(uint256 indexed scholarshipId, address indexed creator, uint256 totalAmount)",
    "event ApplicationSubmitted(uint256 indexed scholarshipId, uint256 indexed applicationId, address applicant)",
    "event ApplicationStatusChanged(uint256 indexed applicationId, uint8 status)",
    "event GrantAwarded(uint256 indexed scholarshipId, address indexed recipient, uint256 amount)",
    "event ScholarshipCancelled(uint256 indexed scholarshipId, string reason, uint256 refundAmount)",
    "event ScholarshipWithdrawn(uint256 indexed scholarshipId, uint256 refundAmount)",
    
    // View Functions
    "function getScholarships() external view returns (tuple(uint256 id, string name, string details, uint256 grantAmount, uint256 remainingGrants, uint256 totalGrants, uint256 endDate, address creator, bool active, uint256 createdAt, bool isCancelled, string cancellationReason, uint256 cancelledAt)[] memory)",
    "function getUserApplications(address user) external view returns (tuple(uint256 id, uint256 scholarshipId, address applicant, string name, string details, uint8 status, uint256 appliedAt)[] memory)",
    
    // State Changing Functions
    "function postScholarship(string calldata name, string calldata details, uint256 grantAmount, uint256 numberOfGrants, uint256 endDate) external payable",
    "function applyForScholarship(uint256 scholarshipId, string calldata name, string calldata details) external",
    "function approveApplication(uint256 scholarshipId, uint256 applicationId) external",
    "function cancelScholarship(uint256 scholarshipId, string calldata reason) external",
    "function withdrawExpiredScholarship(uint256 scholarshipId) external",
    "function getApplicationsForScholarship(uint256 scholarshipId) external view returns (tuple(uint256 id, uint256 scholarshipId, address applicant, string name, string details, uint8 status, uint256 appliedAt)[] memory)",
    "function hasApplied(uint256 scholarshipId, address user) external view returns (bool)"
];

// Define a type that includes both read-only and connected contracts
type Contract = EthersContract;

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
                const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider) as Contract;
                setContract(readOnlyContract);
                setIsInitialized(true);

                // If wallet is connected, add signer
                if (typeof window.ethereum !== 'undefined') {
                    const walletProvider = new ethers.BrowserProvider(window.ethereum);
                    const network = await walletProvider.getNetwork();
                    
                    if (network.chainId === BigInt(656476)) {
                        const signer = await walletProvider.getSigner();
                        setSigner(signer);
                        
                        // Create contract instance with signer for write operations
                        const contractWithSigner = readOnlyContract.connect(signer) as Contract;
                        setContract(contractWithSigner);
                    }
                }
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

            // The result is an array where each element is an array of values
            // We need to parse it according to the struct fields order
            const scholarships = Array.isArray(result) ? result : [result];
            
            const formattedScholarships = scholarships.map((scholarship: any) => {
                console.log('Processing scholarship:', scholarship);
                return {
                    id: Number(scholarship[0]),          // uint256 id
                    name: scholarship[1],                // string name
                    details: scholarship[2],             // string details
                    grantAmount: ethers.formatEther(scholarship[3]), // uint256 grantAmount
                    remainingGrants: Number(scholarship[4]), // uint256 remainingGrants
                    totalGrants: Number(scholarship[5]),     // uint256 totalGrants
                    endDate: new Date(Number(scholarship[6]) * 1000), // uint256 endDate
                    creator: scholarship[7],             // address creator
                    active: scholarship[8],              // bool active
                    createdAt: new Date(Number(scholarship[9]) * 1000), // uint256 createdAt
                    isCancelled: scholarship[10],
                    cancellationReason: scholarship[11],
                    cancelledAt: scholarship[12] > 0 ? new Date(Number(scholarship[12]) * 1000) : null
                };
            });
            
            console.log('Formatted scholarships:', formattedScholarships);
            return formattedScholarships;
        } catch (error) {
            console.error('Error fetching scholarships:', error);
            return [];
        }
    };

    const createScholarship = async (
        name: string,
        details: string,
        grantAmount: string,
        numberOfGrants: number,
        endDate: Date
    ) => {
        if (!contract || !signer) throw new Error('Contract not initialized');
        
        try {
            const grantAmountWei = ethers.parseEther(grantAmount);
            const totalAmount = grantAmountWei * BigInt(numberOfGrants);
            // Convert to Unix timestamp in seconds
            const unixEndDate = Math.floor(endDate.getTime() / 1000);

            console.log('Creating scholarship with params:', {
                name,
                details,
                grantAmountWei: grantAmountWei.toString(),
                numberOfGrants,
                unixEndDate,
                totalAmount: totalAmount.toString()
            });

            const tx = await contract.postScholarship(
                name,
                details,
                grantAmountWei,
                numberOfGrants,
                unixEndDate,
                { value: totalAmount }
            );
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Error creating scholarship:', error);
            throw error;
        }
    };

    const getUserActivity = async (address: string) => {
        if (!contract) return { applications: [], createdScholarships: [] };
        
        try {
            const [applications, allScholarships] = await Promise.all([
                contract.getUserApplications(address),
                contract.getScholarships()
            ]);

            // Create a map of scholarship IDs to their full details
            const scholarshipMap = allScholarships.reduce((map: {[key: string]: any}, s: any) => {
                map[Number(s[0])] = {
                    name: s[1],
                    grantAmount: ethers.formatEther(s[3]),
                    isCancelled: s[10],
                    cancellationReason: s[11],
                    cancelledAt: s[12] > 0 ? new Date(Number(s[12]) * 1000) : null
                };
                return map;
            }, {});

            return {
                applications: applications.map((a: any) => ({
                    id: Number(a.id),
                    scholarshipId: Number(a.scholarshipId),
                    name: scholarshipMap[Number(a.scholarshipId)]?.name || 'Unknown Scholarship',
                    details: a.details,
                    status: ['Applied', 'Approved', 'Rejected'][Number(a.status)],
                    appliedAt: new Date(Number(a.appliedAt) * 1000),
                    grantAmount: scholarshipMap[Number(a.scholarshipId)]?.grantAmount || '0',
                    scholarship: scholarshipMap[Number(a.scholarshipId)] // Include full scholarship details
                })),
                createdScholarships: allScholarships
                    .filter((s: any) => s[7].toLowerCase() === address.toLowerCase())
                    .map((s: any) => ({
                        id: Number(s[0]),
                        name: s[1],
                        grantAmount: ethers.formatEther(s[3]),
                        remainingGrants: Number(s[4]),
                        endDate: new Date(Number(s[6]) * 1000),
                        isCancelled: s[10],
                        cancellationReason: s[11],
                        cancelledAt: s[12] > 0 ? new Date(Number(s[12]) * 1000) : null
                    }))
            };
        } catch (error) {
            console.error('Error fetching user activity:', error);
            return { applications: [], createdScholarships: [] };
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