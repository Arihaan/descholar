// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Script.sol";
import "../src/descholar.sol";

contract DeployDescholar is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Descholar desch = new Descholar(msg.sender);

        desch.postScholarship(
            "Demo Scholarship",
            "This is a demo scholarship for testing purposes.",
            500000000000000000,
            1,
            block.timestamp + 30 days,
            address(0)
        );

        console.log(
            "Deployed descholar contract at address: %s",
            address(desch)
        );
        vm.stopBroadcast();
    }
}
