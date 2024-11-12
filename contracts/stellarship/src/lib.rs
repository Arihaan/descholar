#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Scholarship {
    name: String,
    details: String,
    available_grants: u32,
    total_grant_amount: i128,
    end_date: u64,
    admin: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Application {
    applicant: Address,
    scholarship_name: String,
    details: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ApplicationStatus {
    Pending,
    Approved,
    Rejected,
}

#[contract]
pub struct StellarshipContract;

#[contractimpl]
impl StellarshipContract {
    pub fn post_scholarship(
        env: &Env,
        scholarship: Scholarship,
        token_address: Address,
    ) -> Vec<Scholarship> {
        //CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC //xlm testnet

        scholarship
            .admin
            .require_auth_for_args(token_address.clone().into_val(&env));

        //check grant amount/validate inputs
        if scholarship.total_grant_amount <= 0 || scholarship.available_grants <= 0 {
            panic!("Total grant amount cannot be negative");
        }

        //transfer tokens to contract
        let contract_address = env.current_contract_address();
        Self::move_token(
            &env,
            &token_address,
            &scholarship.admin, //from
            &contract_address,  //to
            scholarship.total_grant_amount,
        );

        //create scholarship
        let mut scholarships = Self::get_scholarships(env);
        scholarships.push_back(scholarship);

        //store scholarship
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "scholarships"), &scholarships);
        return scholarships;
    }

    pub fn apply(env: &Env, application: Application) -> Vec<Application> {
        let mut applications = Self::get_applications(env);
        applications.push_back(application);
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "applications"), &applications);
        applications
    }

    pub fn get_scholarships(env: &Env) -> Vec<Scholarship> {
        return env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "scholarships"))
            .unwrap_or_else(|| Vec::new(env));
    }

    pub fn get_applications(env: &Env) -> Vec<Application> {
        return env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "applications"))
            .unwrap_or_else(|| Vec::new(env));
    }

    fn move_token(env: &Env, token: &Address, from: &Address, to: &Address, transfer_amount: i128) {
        let token = token::Client::new(env, token);

        // This call needs to be authorized by `from` address. It directly transfers
        // the specified `transfer_amount` from `from` to `to`.
        token.transfer(from, to, &transfer_amount);
    }
}
