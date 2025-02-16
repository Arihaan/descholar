// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Scholarship, ApplicationStatus} from "./descholar.utilities.sol";

// import "@openzeppelin/contracts/utils/Address.sol";

contract Descholar is ReentrancyGuard, Ownable, Pausable {
    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) {}

    //add custom errors

    // Events
    event ScholarshipCreated(
        uint256 indexed scholarshipId,
        address indexed creator,
        uint256 totalAmount
    );
    event ApplicationSubmitted(
        uint256 indexed scholarshipId,
        uint256 indexed applicationId,
        address applicant
    );
    event ApplicationStatusChanged(
        uint256 indexed applicationId,
        ApplicationStatus status
    );
    event GrantAwarded(
        uint256 indexed scholarshipId,
        address indexed recipient,
        uint256 amount
    );
    event ScholarshipCancelled(
        uint256 indexed scholarshipId,
        string reason,
        uint256 refundAmount
    );
    event ScholarshipWithdrawn(
        uint256 indexed scholarshipId,
        uint256 refundAmount
    );

    struct Application {
        uint256 id;
        uint256 scholarshipId;
        address applicant;
        string name;
        string details;
        ApplicationStatus status;
        uint256 appliedAt;
    }

    // State variables
    Scholarship[] public scholarships;
    Application[] public applications;

    // Mappings for efficient queries
    mapping(address => uint256[]) public userApplications;
    mapping(address => uint256[]) public userScholarships;
    mapping(uint256 => uint256[]) public scholarshipApplications;
    mapping(uint256 => mapping(address => bool)) public hasApplied;

    // Constants
    uint256 public constant MIN_GRANT_AMOUNT = 0.01 ether; // 10^16 wei (0.01 ETH)
    uint256 public constant MAX_GRANTS = 1000;

    // Modifiers
    modifier validScholarship(uint256 scholarshipId) {
        require(scholarshipId < scholarships.length, "Invalid scholarship ID");
        _;
    }

    modifier scholarshipActive(uint256 scholarshipId) {
        require(scholarships[scholarshipId].active, "Scholarship not active");
        require(
            block.timestamp < scholarships[scholarshipId].endDate,
            "Scholarship expired"
        );
        _;
    }

    modifier onlyScholarshipCreator(uint256 scholarshipId) {
        require(
            msg.sender == scholarships[scholarshipId].creator,
            "Not scholarship creator"
        );
        _;
    }

    // Main functions
    function postScholarship(
        string calldata name,
        string calldata details,
        uint256 grantAmount,
        uint256 numberOfGrants,
        uint256 endDate,
        address tokenId
    ) external payable whenNotPaused nonReentrant {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(details).length > 0, "Empty details");
        require(grantAmount >= MIN_GRANT_AMOUNT, "Grant amount too low");
        require(
            numberOfGrants > 0 && numberOfGrants <= MAX_GRANTS,
            "Invalid number of grants"
        );
        require(endDate > block.timestamp, "Invalid end date");

        require(checkIsContract(tokenId), "Invalid token address"); // check if address is a contract
        IERC20 token = IERC20(tokenId);
        uint256 totalAmount = grantAmount * numberOfGrants;
        require(
            token.transferFrom(msg.sender, address(this), totalAmount),
            "Transfer failed"
        ); //erc20 support //TODO: custom errors
        // require(msg.value == totalAmount, "Incorrect payment amount"); // old version

        uint256 scholarshipId = scholarships.length;
        scholarships.push(
            Scholarship({
                id: scholarshipId,
                name: name,
                details: details,
                grantAmount: grantAmount,
                remainingGrants: numberOfGrants,
                totalGrants: numberOfGrants,
                endDate: endDate,
                creator: msg.sender,
                active: true,
                createdAt: block.timestamp,
                isCancelled: false,
                cancellationReason: "",
                cancelledAt: 0,
                tokenId: tokenId
            })
        );

        userScholarships[msg.sender].push(scholarshipId);
        emit ScholarshipCreated(scholarshipId, msg.sender, totalAmount);
    }

    function applyForScholarship(
        uint256 scholarshipId,
        string calldata name,
        string calldata details
    )
        external
        whenNotPaused
        nonReentrant
        validScholarship(scholarshipId)
        scholarshipActive(scholarshipId)
    {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(details).length > 0, "Empty details");
        require(!hasApplied[scholarshipId][msg.sender], "Already applied");

        uint256 applicationId = applications.length;
        applications.push(
            Application({
                id: applicationId,
                scholarshipId: scholarshipId,
                applicant: msg.sender,
                name: name,
                details: details,
                status: ApplicationStatus.Applied,
                appliedAt: block.timestamp
            })
        );

        hasApplied[scholarshipId][msg.sender] = true;
        userApplications[msg.sender].push(applicationId);
        scholarshipApplications[scholarshipId].push(applicationId);
        emit ApplicationSubmitted(scholarshipId, applicationId, msg.sender);
    }

    function approveApplication(
        uint256 scholarshipId,
        uint256 applicationId
    )
        external
        whenNotPaused
        nonReentrant
        validScholarship(scholarshipId)
        onlyScholarshipCreator(scholarshipId)
    {
        Application storage application = applications[applicationId];
        require(
            application.scholarshipId == scholarshipId,
            "Application mismatch"
        );
        require(
            application.status == ApplicationStatus.Applied,
            "Invalid application status"
        );

        Scholarship storage scholarship = scholarships[scholarshipId];
        require(scholarship.remainingGrants > 0, "No remaining grants");

        application.status = ApplicationStatus.Approved;
        scholarship.remainingGrants--;

        //rewrite here for erc20
        (bool success, ) = payable(application.applicant).call{
            value: scholarship.grantAmount
        }("");
        require(success, "Transfer failed");

        emit ApplicationStatusChanged(
            applicationId,
            ApplicationStatus.Approved
        );
        emit GrantAwarded(
            scholarshipId,
            application.applicant,
            scholarship.grantAmount
        );
    }

    function cancelScholarship(
        uint256 scholarshipId,
        string calldata reason
    )
        external
        whenNotPaused
        nonReentrant
        validScholarship(scholarshipId)
        onlyScholarshipCreator(scholarshipId)
    {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(scholarship.active, "Scholarship already inactive");
        require(!scholarship.isCancelled, "Scholarship already cancelled");
        require(bytes(reason).length > 0, "Must provide cancellation reason");

        uint256 refundAmount = scholarship.grantAmount *
            scholarship.remainingGrants;

        scholarship.active = false;
        scholarship.remainingGrants = 0;
        scholarship.isCancelled = true;
        scholarship.cancellationReason = reason;
        scholarship.cancelledAt = block.timestamp;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit ScholarshipCancelled(scholarshipId, reason, refundAmount);
    }

    function withdrawExpiredScholarship(
        uint256 scholarshipId
    )
        external
        whenNotPaused
        nonReentrant
        validScholarship(scholarshipId)
        onlyScholarshipCreator(scholarshipId)
    {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(!scholarship.isCancelled, "Scholarship was cancelled");
        require(
            block.timestamp >= scholarship.endDate,
            "Scholarship not expired"
        );
        require(scholarship.remainingGrants > 0, "No grants remaining");
        require(
            scholarship.active,
            "Scholarship already withdrawn or cancelled"
        );

        uint256 refundAmount = scholarship.grantAmount *
            scholarship.remainingGrants;

        scholarship.active = false;
        scholarship.remainingGrants = 0;

        //rewrite here for erc20
        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund transfer failed");

        emit ScholarshipWithdrawn(scholarshipId, refundAmount);
    }

    // View functions
    function getScholarships() external view returns (Scholarship[] memory) {
        return scholarships;
    }

    function getApplicationsForScholarship(
        uint256 scholarshipId
    )
        external
        view
        validScholarship(scholarshipId)
        returns (Application[] memory)
    {
        uint256[] memory applicationIds = scholarshipApplications[
            scholarshipId
        ];
        Application[] memory result = new Application[](applicationIds.length);

        for (uint256 i = 0; i < applicationIds.length; i++) {
            result[i] = applications[applicationIds[i]];
        }
        return result;
    }

    function getUserApplications(
        address user
    ) external view returns (Application[] memory) {
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

    //private functions - helpers
    function checkIsContract(
        address target
    ) private view returns (bool isContract) {
        if (target.code.length == 0) {
            isContract = false;
        } else {
            isContract = true;
        }
    }
}
