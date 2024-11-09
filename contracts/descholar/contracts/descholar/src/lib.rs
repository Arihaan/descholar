#![no_std]
use soroban_sdk::{
    contract, contractimpl, vec, Address, Env, String, Symbol, Vec,
    map::Map, contracterror, token::{TokenClient, StellarAssetClient},
};

// Error definitions
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidAmount = 1,
    Unauthorized = 2,
    ApplicationNotFound = 3,
    ScholarshipNotFound = 4,
    ScholarshipExpired = 5,
    AlreadyApplied = 6,
    InsufficientFunds = 7,
}

// Status enum for applications
#[derive(Clone)]
pub enum ApplicationStatus {
    Applied,
    Approved,
    Rejected,
}

// Structs
#[derive(Clone)]
pub struct Scholarship {
    id: u32,
    name: String,
    details: String,
    grant_amount: i128,
    number_of_grants: u32,
    grants_remaining: u32,
    end_date: u64,
    applications: Vec<Application>,
    creator_address: Address,
}

#[derive(Clone)]
pub struct Application {
    scholarship_id: u32,
    name: String,
    details: String,
    status: ApplicationStatus,
    applicant_address: Address,
}

#[contract]
pub struct DescholarContract;

#[contractimpl]
impl DescholarContract {
    const NATIVE_ASSET_CONTRACT_ID: &'static str = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

    // Initialize contract data
    pub fn initialize(env: Env) {
        let scholarships: Map<u32, Scholarship> = Map::new(&env);
        env.storage().instance().set(&Symbol::short("scholarships"), &scholarships);
        env.storage().instance().set(&Symbol::short("scholarship_counter"), &0u32);
    }

    // Post a new scholarship
    pub fn post_scholarship(
        env: Env,
        name: String,
        details: String,
        grant_amount: i128,
        number_of_grants: u32,
        end_date: u64,
    ) -> u32 {
        // Validate inputs
        if grant_amount <= 0 || number_of_grants == 0 {
            panic!("Invalid grant amount or number of grants");
        }

        let creator = env.invoker();
        let total_amount = grant_amount * (number_of_grants as i128);

        // Use the testnet native asset contract
        let token = TokenClient::new(
            &env,
            &Address::from_string(Self::NATIVE_ASSET_CONTRACT_ID)
        );

        // Transfer XLM from creator to contract
        token.transfer(
            &creator,
            &env.current_contract_address(),
            &total_amount
        );

        // Create new scholarship
        let mut counter: u32 = env.storage().instance().get(&Symbol::short("scholarship_counter")).unwrap();
        counter += 1;

        let scholarship = Scholarship {
            id: counter,
            name,
            details,
            grant_amount,
            number_of_grants,
            grants_remaining: number_of_grants,
            end_date,
            applications: Vec::new(&env),
            creator_address: creator,
        };

        // Store scholarship
        let mut scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        scholarships.set(counter, scholarship);
        env.storage().instance().set(&Symbol::short("scholarships"), &scholarships);
        env.storage().instance().set(&Symbol::short("scholarship_counter"), &counter);

        counter
    }

    // Get all scholarships
    pub fn get_scholarships(env: Env) -> Vec<Scholarship> {
        let scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        let mut result = Vec::new(&env);
        for (_, scholarship) in scholarships.iter() {
            result.push_back(scholarship);
        }
        result
    }

    // Apply for scholarship
    pub fn apply_for_scholarship(
        env: Env,
        scholarship_id: u32,
        name: String,
        details: String,
    ) {
        let applicant = env.invoker();
        let mut scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        
        let mut scholarship = scholarships.get(scholarship_id)
            .unwrap_or_else(|| panic!("Scholarship not found"));

        // Validate application
        if env.ledger().timestamp() > scholarship.end_date {
            panic!("Scholarship has expired");
        }

        // Check if user has already applied
        for app in scholarship.applications.iter() {
            if app.applicant_address == applicant {
                panic!("Already applied to this scholarship");
            }
        }

        let application = Application {
            scholarship_id,
            name,
            details,
            status: ApplicationStatus::Applied,
            applicant_address: applicant,
        };

        scholarship.applications.push_back(application);
        scholarships.set(scholarship_id, scholarship);
        env.storage().instance().set(&Symbol::short("scholarships"), &scholarships);
    }

    // Approve applicant
    pub fn approve_applicant(
        env: Env,
        scholarship_id: u32,
        applicant_address: Address,
    ) {
        let caller = env.invoker();
        let mut scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        
        let mut scholarship = scholarships.get(scholarship_id)
            .unwrap_or_else(|| panic!("Scholarship not found"));

        // Verify caller is scholarship creator
        if scholarship.creator_address != caller {
            panic!("Unauthorized");
        }

        // Find and update application
        let mut found = false;
        for i in 0..scholarship.applications.len() {
            let mut app = scholarship.applications.get(i).unwrap();
            if app.applicant_address == applicant_address && matches!(app.status, ApplicationStatus::Applied) {
                app.status = ApplicationStatus::Approved;
                scholarship.applications.set(i, app);
                found = true;

                // Use the testnet native asset contract
                let token = TokenClient::new(
                    &env,
                    &Address::from_string(Self::NATIVE_ASSET_CONTRACT_ID)
                );

                // Transfer grant amount to applicant
                token.transfer(
                    &env.current_contract_address(),
                    &applicant_address,
                    &scholarship.grant_amount
                );

                scholarship.grants_remaining -= 1;
                break;
            }
        }

        if !found {
            panic!("Application not found or already processed");
        }

        scholarships.set(scholarship_id, scholarship);
        env.storage().instance().set(&Symbol::short("scholarships"), &scholarships);
    }

    // Reject applicant
    pub fn reject_applicant(
        env: Env,
        scholarship_id: u32,
        applicant_address: Address,
    ) {
        let caller = env.invoker();
        let mut scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        
        let mut scholarship = scholarships.get(scholarship_id)
            .unwrap_or_else(|| panic!("Scholarship not found"));

        if scholarship.creator_address != caller {
            panic!("Unauthorized");
        }

        let mut found = false;
        for i in 0..scholarship.applications.len() {
            let mut app = scholarship.applications.get(i).unwrap();
            if app.applicant_address == applicant_address && matches!(app.status, ApplicationStatus::Applied) {
                app.status = ApplicationStatus::Rejected;
                scholarship.applications.set(i, app);
                found = true;
                break;
            }
        }

        if !found {
            panic!("Application not found or already processed");
        }

        scholarships.set(scholarship_id, scholarship);
        env.storage().instance().set(&Symbol::short("scholarships"), &scholarships);
    }

    // Get scholarships posted by user
    pub fn get_posted_scholarships(env: Env, user_address: Address) -> Vec<Scholarship> {
        let scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        let mut result = Vec::new(&env);
        
        for (_, scholarship) in scholarships.iter() {
            if scholarship.creator_address == user_address {
                result.push_back(scholarship);
            }
        }
        result
    }

    // Get scholarships applied to by user
    pub fn get_applied_scholarships(env: Env, user_address: Address) -> Vec<Scholarship> {
        let scholarships: Map<u32, Scholarship> = env.storage().instance().get(&Symbol::short("scholarships")).unwrap();
        let mut result = Vec::new(&env);
        
        for (_, scholarship) in scholarships.iter() {
            for app in scholarship.applications.iter() {
                if app.applicant_address == user_address {
                    result.push_back(scholarship.clone());
                    break;
                }
            }
        }
        result
    }
}

