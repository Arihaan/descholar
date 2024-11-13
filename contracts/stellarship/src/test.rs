#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, String};
#[test]
fn test_post_scholarship_success() {
    let env = Env::default();
    let contract_id = env.register_contract(None, StellarshipContract);
    let client = StellarshipContractClient::new(&env, &contract_id);

    let scholarship = Scholarship {
        name: String::from_str(&env, "Scholarship1"),
        details: String::from_str(&env, "Scholarship Details"),
        available_grants: 10,
        total_grant_amount: 1000,
        end_date: 1672531199,
        admin: Address::from_account_id(&env, &env.accounts().generate()),
    };

    // Assuming XLM testnet token address is known and passed here
    let xlm_token_address = Address::from_contract_id(
        &env,
        &"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    );

    // Send XLM to the contract
    env.accounts()
        .transfer(&scholarship.admin, &contract_id, 1000);

    let result = client.post_scholarship(&scholarship, &xlm_token_address);
    assert!(result.is_ok());
    let scholarships = client.get_scholarships();
    assert_eq!(scholarships.len(), 1);
    assert_eq!(scholarships.get(0).unwrap().name, scholarship.name);
}
