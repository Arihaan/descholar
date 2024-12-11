// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface Interface {
    type ApplicationStatus is uint8;

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

    function applications(
        uint256
    )
        external
        view
        returns (
            uint256 id,
            address applicant,
            uint256 scholarship_id,
            string memory applicant_name,
            string memory details,
            ApplicationStatus status
        );

    function apply_for_scholarship(Application memory application) external;

    function get_applications() external view returns (Application[] memory);

    function get_applications_from_scholarship(
        uint256 scholarship_id
    ) external view returns (Application[] memory);

    function get_my_applications() external view returns (Application[] memory);

    function get_my_scholarships(
        address admin
    ) external view returns (Scholarship[] memory);

    function get_schoolarships() external view returns (Scholarship[] memory);

    function pick_granted_students(
        uint256 scholarship_id,
        address[] memory students
    ) external;

    function post_scholarship(Scholarship memory scholarship) external payable;

    function reject_application(uint256 application_id) external;

    function scholarships(
        uint256
    )
        external
        view
        returns (
            uint256 id,
            string memory name,
            string memory details,
            uint256 available_grants,
            int256 student_grant_amount,
            uint256 end_date,
            address admin,
            address token
        );
}
