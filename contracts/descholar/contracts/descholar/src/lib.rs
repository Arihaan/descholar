#![no_std]

// ! To deploy the contract, run the following command:
// TODO actualy fix it and make it work
/*
soroban contract invoke \
    --id CC3S33I4T7CNK7DUPLQAKTBFK4OIBB6MBCSLLXY57JK2WWCC4VKRZS75
    --source alice \
    --network testnet \
    -- \
    post_scholarship \
        --admin alice \
        --available_grants 10 \
        --details "test details" \
        --total_grant_amount 1000 \
        --end_date 1000000 \
        --name "test" \
        --token_address CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC \
    --amount 1000
*/
/**
 * ! @file lib.rs
 * ? @brief Stellarship Contract for managing scholarships and applications.
 *
 * This contract provides functionalities to post scholarships, apply for scholarships,
 * and retrieve scholarships and applications.
 *
 * * Functions
 *
 * ! @fn post_scholarship
 * ? @brief Posts a new scholarship.
 * @param env A reference to the environment.
 * @param scholarship A Scholarship struct containing scholarship details.
 * @param token_address The address of the token for scholarship funding.
 * @return A vector of Scholarship structs representing posted scholarships.
 * * Transfers the total grant amount to the contract.
 *
 * ! @fn apply
 * ? @brief Submits an application for a scholarship.
 * @param env A reference to the environment.
 * @param application An Application struct containing application details.
 * @return A list of Application structs representing all applications.
 *
 * ! @fn pick_granted_students
 * ? @brief Picks students to be granted a scholarship.
 * @param env A reference to the environment.
 * @param scholarship_name The name of the scholarship to pick students for.
 * @param students A list of student addresses to be granted the scholarship.
 * @param caller The address of the caller picking the students.
 *
 *
 * ! @fn get_scholarships
 * ? @brief Retrieves all posted scholarships.
 * @param env A reference to the environment.
 * @return A vector of Scholarship structs representing all scholarships.
 *
 * ! @fn get_my_scholarships
 * ? @brief Retrieves scholarships posted by the specified admin address.
 * @param env A reference to the environment.
 * @param address The admin address whose scholarships are to be retrieved.
 * @return A list of Scholarship structs associated with the specified admin.
 *
 * ! @fn get_applications
 * ? @brief Retrieves all submitted applications.
 * @param env A reference to the environment.
 * @return A list of Application structs representing all applications.
 *
 * ! @fn get_my_applications
 * ? @brief Retrieves applications submitted by the specified applicant address.
 * @param env A reference to the environment.
 * @param address The applicant address whose applications are to be retrieved.
 * @return A list of Application structs associated with the specified applicant.
 *
 * ! @fn move_token
 * ? @brief Transfers tokens from one address to another.
 * @param env A reference to the environment.
 * @param token The address of the token to transfer.
 * @param from The address from which tokens are to be transferred.
 * @param to The address to which tokens are to be transferred.
 * @param transfer_amount The amount of tokens to transfer.
 * * This function is used internally by the contract.
 */
use soroban_sdk::{
    contract, contractimpl, contracttype, log, token, Address, Env, String, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Scholarship {
    name: String, //* name is also an id
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
        //CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC // *xlm testnet

        // ! Test if this is working
        scholarship.admin.require_auth();

        //if call doesn't send enough tokens, it will fail
        let token_client = token::Client::new(&env, &token_address);
        let balance = token_client.balance(&scholarship.admin);

        token_client.transfer(
            &scholarship.admin,
            &env.current_contract_address(),
            &scholarship.total_grant_amount,
        );

        let new_balance = token_client.balance(&env.current_contract_address());
        assert!(
            new_balance == balance + &scholarship.total_grant_amount,
            "Transfer amount not received"
        );
        log!(env, "The value is: {}", balance);
        if balance <= 0 {
            log!(env, "The value is: {}", balance);
            panic!("hello {}", balance);
        }

        //check grant amount/validate inputs
        if scholarship.total_grant_amount <= 0 || scholarship.available_grants <= 0 {
            panic!("Total grant amount cannot be negative");
        }

        //check if scholarship name already exists
        let mut scholarships = Self::get_scholarships(env);
        for existing_scholarship in scholarships.iter() {
            if existing_scholarship.name == scholarship.name {
                panic!("Scholarship name already exists");
            }
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

    pub fn pick_granted_students(
        env: &Env,
        scholarship_name: String,
        students: Vec<Address>,
        caller: Address,
    ) {
        let scholarships = Self::get_scholarships(env);
        let mut updated_scholarships = Vec::new(env);
        for mut scholarship in scholarships.iter() {
            if scholarship.name == scholarship_name {
                if scholarship.available_grants < students.len() as u32 {
                    panic!("Not enough grants available");
                }
                if &caller != &scholarship.admin {
                    panic!("Only the scholarship admin can pick students");
                }
                scholarship.available_grants -= students.len() as u32;
                updated_scholarships.push_back(scholarship.clone());
            } else {
                updated_scholarships.push_back(scholarship.clone());
            }
        }
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "scholarships"), &updated_scholarships);
    }

    pub fn get_my_scholarships(env: &Env, address: Address) -> Vec<Scholarship> {
        let scholarships = Self::get_scholarships(env);
        let mut my_scholarships = Vec::new(env);
        for scholarship in scholarships.iter() {
            if scholarship.admin == address {
                my_scholarships.push_back(scholarship.clone());
            }
        }
        return my_scholarships;
    }

    pub fn get_applications(env: &Env) -> Vec<Application> {
        return env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "applications"))
            .unwrap_or_else(|| Vec::new(env));
    }

    pub fn get_my_applications(env: &Env, address: Address) -> Vec<Application> {
        let applications = Self::get_applications(env);
        let mut my_applications = Vec::new(env);
        for application in applications.iter() {
            if application.applicant == address {
                my_applications.push_back(application.clone());
            }
        }
        return my_applications;
    }

    pub fn get_applications_frm_schlrship(env: &Env, scholarship_name: String) -> Vec<Application> {
        let applications = Self::get_applications(env);
        let mut scholarship_applications = Vec::new(env);
        for application in applications.iter() {
            if application.scholarship_name == scholarship_name {
                scholarship_applications.push_back(application.clone());
            }
        }
        return scholarship_applications;
    }

    fn move_token(env: &Env, token: &Address, from: &Address, to: &Address, transfer_amount: i128) {
        let token = token::Client::new(env, token);

        // This call needs to be authorized by `from` address. It directly transfers
        // the specified `transfer_amount` from `from` to `to`.
        token.transfer(from, to, &transfer_amount);
    }
}

mod test;
