// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

enum ApplicationStatus {
    Pending,
    Approved,
    Rejected
}

struct Application {
    uint256 id;
    address applicant;
    uint256 scholarship_id;
    string applicant_name;
    string details;
    ApplicationStatus status;
}

struct Scholarship {
    uint256 id;
    string name;
    string details;
    uint256 available_grants;
    int256 student_grant_amount;
    uint256 end_date;
    address admin;
    address token;
}

contract descholar {
    Scholarship[] public scholarships;
    Application[] public applications;

    function post_scholarship(Scholarship memory scholarship) public payable {
        require(
            scholarship.student_grant_amount > 0,
            "Total grant amount cannot be negative"
        );
        require(
            scholarship.available_grants > 0,
            "Available grants must be greater than zero"
        );

        scholarship.id = scholarships.length;
        scholarships.push(scholarship);

        IERC20 token = IERC20(scholarship.token);
        uint256 total_amount = uint256(scholarship.student_grant_amount) *
            scholarship.available_grants;

        require(msg.value == total_amount, "Incorrect Ether amount sent");
        require(
            token.transferFrom(scholarship.admin, address(this), total_amount),
            "Transfer failed"
        );
    }
}
