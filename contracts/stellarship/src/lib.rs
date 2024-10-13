#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Env, String, Vec, Address, Symbol};

#[contracttype]
pub struct Scholarship {
    name: String,
    details: String,
    available_grants: u32,
    total_grant_amount: i128,
    end_date: u64,
}

#[contracttype]
pub struct Application {
    applicant: Address,
    scholarship_name: String,
    details: String,
}

#[contract]
pub struct StellarshipContract;

#[contractimpl]
impl StellarshipContract {
    pub fn post_scholarship(env: Env, scholarship: Scholarship) -> Vec<Scholarship> {
        let mut scholarships = Self::get_scholarships(&env);
        scholarships.push_back(scholarship);
        env.storage().persistent().set(&Symbol::new(&env, "scholarships"), &scholarships);
        scholarships
    }

    pub fn apply(env: Env, application: Application) -> Vec<Application> {
        let mut applications = Self::get_applications(&env);
        applications.push_back(application);
        env.storage().persistent().set(&Symbol::new(&env, "applications"), &applications);
        applications
    }

    pub fn get_scholarships(env: &Env) -> Vec<Scholarship> {
        env.storage().persistent().get(&Symbol::new(env, "scholarships")).unwrap_or_else(|| Vec::new(env))
    }

    pub fn get_applications(env: &Env) -> Vec<Application> {
        env.storage().persistent().get(&Symbol::new(env, "applications")).unwrap_or_else(|| Vec::new(env))
    }
}
