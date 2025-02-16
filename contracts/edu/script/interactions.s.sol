// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import {Script} from "@forge-std/Script.sol";
import "forge-std/Script.sol";
import "../lib/foundry-devops/src/DevOpsTools.sol";
import {Descholar} from "../src/descholar.sol";
import {Scholarship} from "../src/descholar.utilities.sol";

contract PostScholarship is Script {
    address public USER = makeAddr("user");

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment(
            "Descholar",
            block.chainid
        );

        vm.startBroadcast();
        Descholar(mostRecentlyDeployed).postScholarship(
            "My Scholarship",
            "Some details here",
            1000, // grantAmount
            10, // totalGrants
            1700000000, // endDate
            address(0) // tokenId
        );
        vm.stopBroadcast();
    }
}
