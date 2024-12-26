// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "./../lib/foundry-devops/src/DevOpsTools.sol";
import {descholar, Scholarship} from "./../src/descholar.sol";

contract PostScholarship is Script {
    address public USER = makeAddr("user");

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment(
            "Descholar",
            block.chainid
        );
        vm.startBroadcast();

        Scholarship memory scholarship = Scholarship({
            id: 0,
            name: "My Scholarship",
            details: "Some details here",
            available_grants: 10,
            student_grant_amount: 1000,
            end_date: 1700000000,
            admin: msg.sender,
            token: address(0)
        });

        descholar(mostRecentlyDeployed).post_scholarship(scholarship);
        vm.stopBroadcast();
    }
}
