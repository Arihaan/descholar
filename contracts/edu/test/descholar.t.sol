// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/descholar.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract DescholarTest is Test {
    descholar public descholarContract;
    MockERC20 public mockToken;
    address public admin = address(0x1);
    uint256 public grantAmount = 1000 * 10 ** 18;
    uint256 public availableGrants = 10;
    uint256 public totalAmount;

    function setUp() public {
        // Deploy mock ERC20 token
        mockToken = new MockERC20("MockToken", "MTK");
        // Mint tokens to admin
        mockToken.mint(admin, grantAmount * availableGrants);
        // Deploy descholar contract
        descholarContract = new descholar();
        // Deal admin some ETH
        vm.deal(admin, grantAmount * availableGrants);
    }

    function testPostScholarship() public {
        // Define scholarship
        Scholarship memory scholarship = Scholarship({
            id: 0,
            name: "Test Scholarship",
            details: "A test scholarship.",
            available_grants: availableGrants,
            student_grant_amount: int256(grantAmount),
            end_date: block.timestamp + 30 days,
            admin: admin,
            token: address(mockToken)
        });

        // Prank as admin
        vm.startPrank(admin);
        // Approve descholar contract to spend tokens
        mockToken.approve(
            address(descholarContract),
            grantAmount * availableGrants
        );

        // Calculate total amount
        totalAmount = grantAmount * availableGrants;

        // Call post_scholarship with correct Ether
        descholarContract.post_scholarship{value: totalAmount}(scholarship);

        // Stop prank
        vm.stopPrank();

        // Verify scholarship is added
        Scholarship memory storedScholarship = descholarContract
            .get_schoolarships()[0];

        assertEq(storedScholarship.name, "Test Scholarship");
        assertEq(storedScholarship.available_grants, availableGrants);
        assertEq(storedScholarship.student_grant_amount, int256(grantAmount));
        assertEq(storedScholarship.admin, admin);
        assertEq(storedScholarship.token, address(mockToken));

        // Verify tokens are transferred to descholar contract
        uint256 contractBalance = mockToken.balanceOf(
            address(descholarContract)
        );
        assertEq(contractBalance, totalAmount);

        // Verify admin's token balance
        uint256 adminBalance = mockToken.balanceOf(admin);
        assertEq(adminBalance, 0);
    }
}
