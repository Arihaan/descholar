// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

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
    bool isCancelled;
    string cancellationReason;
    uint256 cancelledAt;
    address tokenId; //erc20 support
}

enum ApplicationStatus {
    Applied,
    Approved,
    Rejected
}
