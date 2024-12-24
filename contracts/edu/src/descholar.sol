// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Descholar is ReentrancyGuard, Ownable, Pausable {
    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) { }

    // Events
    event ScholarshipCreated(uint256 indexed scholarshipId, address indexed creator, uint256 totalAmount);
    event ApplicationSubmitted(uint256 indexed scholarshipId, uint256 indexed applicationId, address applicant);
    event ApplicationStatusChanged(uint256 indexed applicationId, ApplicationStatus status);
    event GrantAwarded(uint256 indexed scholarshipId, address indexed recipient, uint256 amount);

    enum ApplicationStatus {
        Applied,
        Approved,
        Rejected
    }

    struct Application {
        uint256 id;
        uint256 scholarshipId;
        address applicant;
        string name;
        string details;
        ApplicationStatus status;
        uint256 appliedAt;
    }

    struct Scholarship {
        uint256 id;
        string name;
        string details;
        uint256 grantAmount;
        uint256 remainingGrants;
        uint256 totalGrants;
        uint256 endDate;
        address creator;
        bool active;
        uint256 createdAt;
    }

    // State variables
    Scholarship[] public scholarships;
    Application[] public applications;
    
    // Mappings for efficient queries
    mapping(address => uint256[]) public userApplications;
    mapping(address => uint256[]) public userScholarships;
    mapping(uint256 => uint256[]) public scholarshipApplications;

    // Constants
    uint256 public constant MIN_GRANT_AMOUNT = 0.01 ether;  // 10^16 wei (0.01 ETH)
    uint256 public constant MAX_GRANTS = 1000;
    // Example timestamps for reference:
    // Jan 28 2025 00:00:00 GMT = 1738022400
    // To convert a date: Use Unix timestamp converter or
    // new Date("2025-01-28").getTime() / 1000 in JavaScript

    // Modifiers
    modifier validScholarship(uint256 scholarshipId) {
        require(scholarshipId < scholarships.length, "Invalid scholarship ID");
        _;
    }

    modifier scholarshipActive(uint256 scholarshipId) {
        require(scholarships[scholarshipId].active, "Scholarship not active");
        require(block.timestamp < scholarships[scholarshipId].endDate, "Scholarship expired");
        _;
    }

    modifier onlyScholarshipCreator(uint256 scholarshipId) {
        require(msg.sender == scholarships[scholarshipId].creator, "Not scholarship creator");
        _;
    }

    // Main functions
    function postScholarship(
        string calldata name,
        string calldata details,
        uint256 grantAmount,
        uint256 numberOfGrants,
        uint256 endDate
    ) external payable whenNotPaused nonReentrant {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(details).length > 0, "Empty details");
        require(grantAmount >= MIN_GRANT_AMOUNT, "Grant amount too low");
        require(numberOfGrants > 0 && numberOfGrants <= MAX_GRANTS, "Invalid number of grants");
        require(endDate > block.timestamp, "Invalid end date");
        
        uint256 totalAmount = grantAmount * numberOfGrants;
        require(msg.value == totalAmount, "Incorrect payment amount");

        uint256 scholarshipId = scholarships.length;
        scholarships.push(Scholarship({
            id: scholarshipId,
            name: name,
            details: details,
            grantAmount: grantAmount,
            remainingGrants: numberOfGrants,
            totalGrants: numberOfGrants,
            endDate: endDate,
            creator: msg.sender,
            active: true,
            createdAt: block.timestamp
        }));

        userScholarships[msg.sender].push(scholarshipId);
        emit ScholarshipCreated(scholarshipId, msg.sender, totalAmount);
    }

    function applyForScholarship(
        uint256 scholarshipId,
        string calldata name,
        string calldata details
    ) external whenNotPaused nonReentrant 
      validScholarship(scholarshipId) 
      scholarshipActive(scholarshipId) {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(details).length > 0, "Empty details");
        
        uint256 applicationId = applications.length;
        applications.push(Application({
            id: applicationId,
            scholarshipId: scholarshipId,
            applicant: msg.sender,
            name: name,
            details: details,
            status: ApplicationStatus.Applied,
            appliedAt: block.timestamp
        }));

        userApplications[msg.sender].push(applicationId);
        scholarshipApplications[scholarshipId].push(applicationId);
        emit ApplicationSubmitted(scholarshipId, applicationId, msg.sender);
    }

    function approveApplication(
        uint256 scholarshipId,
        uint256 applicationId
    ) external whenNotPaused nonReentrant 
      validScholarship(scholarshipId)
      onlyScholarshipCreator(scholarshipId) {
        Application storage application = applications[applicationId];
        require(application.scholarshipId == scholarshipId, "Application mismatch");
        require(application.status == ApplicationStatus.Applied, "Invalid application status");
        
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(scholarship.remainingGrants > 0, "No remaining grants");

        application.status = ApplicationStatus.Approved;
        scholarship.remainingGrants--;

        (bool success, ) = payable(application.applicant).call{value: scholarship.grantAmount}("");
        require(success, "Transfer failed");

        emit ApplicationStatusChanged(applicationId, ApplicationStatus.Approved);
        emit GrantAwarded(scholarshipId, application.applicant, scholarship.grantAmount);
    }

    // View functions
    function getScholarships() external view returns (Scholarship[] memory) {
        return scholarships;
    }

    function getApplicationsForScholarship(uint256 scholarshipId) 
        external view validScholarship(scholarshipId) 
        returns (Application[] memory) {
        uint256[] memory applicationIds = scholarshipApplications[scholarshipId];
        Application[] memory result = new Application[](applicationIds.length);
        
        for (uint256 i = 0; i < applicationIds.length; i++) {
            result[i] = applications[applicationIds[i]];
        }
        return result;
    }

    function getUserApplications(address user) external view returns (Application[] memory) {
        uint256[] memory applicationIds = userApplications[user];
        Application[] memory result = new Application[](applicationIds.length);
        
        for (uint256 i = 0; i < applicationIds.length; i++) {
            result[i] = applications[applicationIds[i]];
        }
        return result;
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
