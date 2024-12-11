// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Script.sol";
import "../src/descholar.sol";

contract DeployDescholar is Script {
    function run() external {
        vm.startBroadcast();
        new descholar();
        vm.stopBroadcast();
    }
}
