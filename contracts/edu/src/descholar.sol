// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// cast send 0x985Fe4138c1F522503C93b3Ea249C27AEc85cAB7 \
//     "post_scholarship((uint256,string,string,uint256,int256,uint256,address,address))" \
//     "(1,'Test Scholarship','This is a test scholarship',10,1000,1700000000,'0x54d66dfCeFe3f453fc990728DC06E0b05cB0b9ce','0x0000000000000000000000000000000000000000')" \
//     --rpc-url https://open-campus-codex-sepolia.drpc.org \
//     --private-key $PRIVATE_KEY
// to invoke post_scholarship

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
        scholarship.admin = msg.sender;

        // IERC20 token = IERC20(scholarship.token);
        // uint256 total_amount = uint256(scholarship.student_grant_amount) *
        //     scholarship.available_grants;

        // require(msg.value == total_amount, "Incorrect Ether amount sent");
        // require(
        //     token.transferFrom(scholarship.admin, address(this), total_amount),
        //     "Transfer failed"
        // );
    }

    function apply_for_scholarship(Application memory application) public {
        require(
            application.scholarship_id < scholarships.length,
            "Scholarship does not exist"
        );

        Scholarship memory scholarship = scholarships[
            application.scholarship_id
        ];
        require(
            scholarship.available_grants > 0,
            "No grants available for this scholarship"
        );

        application.status = ApplicationStatus.Pending;

        applications.push(application);
    }

    function get_schoolarships() public view returns (Scholarship[] memory) {
        return scholarships;
    }

    function pick_granted_students(
        uint256 scholarship_id,
        address[] memory students
    ) public {
        Scholarship storage scholarship = scholarships[scholarship_id];
        require(
            scholarship.admin == msg.sender,
            "Only the admin can pick students"
        );

        require(
            scholarship.available_grants >= students.length,
            "Not enough grants available"
        );

        scholarship.available_grants -= students.length;

        for (uint256 i = 0; i < students.length; i++) {
            Application storage application = applications[i];
            application.status = ApplicationStatus.Approved;

            IERC20 token = IERC20(scholarship.token);
            require(
                token.transfer(
                    students[i],
                    uint256(scholarship.student_grant_amount)
                ),
                "Transfer failed"
            );
        }
    }

    function get_my_scholarships(
        address admin
    ) public view returns (Scholarship[] memory) {
        Scholarship[] memory my_scholarships;
        uint256 count = 0;

        for (uint256 i = 0; i < scholarships.length; i++) {
            if (scholarships[i].admin == admin) {
                my_scholarships[count] = scholarships[i];
                count++;
            }
        }

        return my_scholarships;
    }

    function get_applications() public view returns (Application[] memory) {
        return applications;
    }

    function get_my_applications() public view returns (Application[] memory) {
        Application[] memory my_applications;
        uint256 count = 0;

        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i].applicant == msg.sender) {
                my_applications[count] = applications[i];
                count++;
            }
        }

        return my_applications;
    }

    function get_applications_from_scholarship(
        uint256 scholarship_id
    ) public view returns (Application[] memory) {
        Application[] memory scholarship_applications;
        uint256 count = 0;

        for (uint256 i = 0; i < applications.length; i++) {
            if (applications[i].scholarship_id == scholarship_id) {
                scholarship_applications[count] = applications[i];
                count++;
            }
        }

        return scholarship_applications;
    }

    function reject_application(uint256 application_id) public {
        Application storage application = applications[application_id];
        Scholarship storage scholarship = scholarships[
            application.scholarship_id
        ];
        require(
            scholarship.admin == msg.sender,
            "Only the admin of the scholarship can reject the application"
        );

        application.status = ApplicationStatus.Rejected;
    }
}
