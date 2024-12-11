// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Script.sol";
import "../src/descholar.sol";

contract DeployDescholar is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        descholar desch = new descholar();

        // desch.post_scholarship{value: 0 ether}(
        //     Scholarship({
        //         id: 0, // ID will be set by the contract
        //         name: "Demo Scholarship",
        //         details: "This is a demo scholarship for testing purposes.",
        //         available_grants: 1,
        //         student_grant_amount: int256(0.5 ether),
        //         end_date: block.timestamp + 30 days,
        //         admin: msg.sender,
        //         token: address(0)
        //     })
        // );

        console.log(
            "Deployed descholar contract at address: %s",
            address(desch)
        );
        vm.stopBroadcast();
    }
}
