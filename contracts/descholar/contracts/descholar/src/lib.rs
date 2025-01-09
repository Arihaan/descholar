#![no_std]
/*
10000000000 - 1000 xlm
1000000000  - 100 xlm
100000000   - 10 xlm
10000000    - 1 xlm
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC // *xlm token address testnet

cargo install --git https://github.com/stellar/stellar-cli soroban-cli //for updating or downloadingle cli

?  latest contract id = CASRFLDQJVNP5XXYMZE6WVWOLYEV6AWF2LJOT3V64EJ22PEJKVEVILYP

CDEWNEKSFT5ZU52CYRQKFJOENL4VQV3K7T5DRX5DD25HUMAELLTWP3DL -- Contract Id from okashi

stellar contract bindings typescript \
  --network testnet \
  --contract-id CDEWNEKSFT5ZU52CYRQKFJOENL4VQV3K7T5DRX5DD25HUMAELLTWP3DL \
  --output-dir bindings --overwrite


*/

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Scholarship {
    id: u64,
    name: String,
    details: String,
    available_grants: u64,
    student_grant_amount: i128,
    end_date: u64,
    admin: Address,
    token: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Application {
    id: u64,
    applicant: Address,
    scholarship_id: u64,
    applicant_name: String,
    details: String,
    status: ApplicationStatus,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ApplicationStatus {
    Pending,
    Approved,
    Rejected,
}

#[contract]
pub struct DescholarContract;

#[contractimpl]
impl DescholarContract {
    pub fn post_scholarship(env: &Env, scholarship: Scholarship) -> Vec<Scholarship> {
        scholarship.admin.require_auth();
        let mut scholarships = Self::get_scholarships(env);

        let mut scholarship = scholarship.clone();
        scholarship.id = scholarships.len() as u64;
        Self::validate_application(scholarship.clone(), scholarships.clone());

        let token_client = token::Client::new(&env, &scholarship.token);
        let old_balance = token_client.balance(&env.current_contract_address());

        let total_amount =
            scholarship.student_grant_amount * (scholarship.available_grants as i128);

        token_client.transfer(
            &scholarship.admin,              // * from
            &env.current_contract_address(), // * to
            &total_amount,                   // * amount
        );

        //* check if transfer amount received
        let new_balance = token_client.balance(&env.current_contract_address());
        assert!(
            new_balance == old_balance + total_amount,
            "Transfer amount not received"
        );
        if new_balance != old_balance + total_amount {
            panic!("Transfer amount not received");
        }

        //create scholarship
        scholarships.push_back(scholarship);

        //store scholarship
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "scholarships"), &scholarships);
        return scholarships;
    }

    pub fn apply(env: &Env, application: Application) -> Vec<Application> {
        //TODO in future check if deadline has passed
        let mut applications = Self::get_applications(env);
        let scholarships = Self::get_scholarships(env);
        let mut scholarship_exists = false;
        for scholarship in scholarships.iter() {
            if scholarship.id == application.scholarship_id {
                scholarship_exists = true;
            }
        }
        if (!scholarship_exists) {
            panic!("Scholarship does not exist");
        }
        let mut new_application = application.clone();
        new_application.status = ApplicationStatus::Pending;
        applications.push_back(new_application);
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
        scholarship_id: u64,
        students: Vec<Address>,
        caller: Address,
    ) {
        let scholarships = Self::get_scholarships(env);
        let mut updated_scholarships = Vec::new(env);

        let applications = Self::get_applications(env);
        let mut updated_applications = Vec::new(env);

        for mut scholarship in scholarships.iter() {
            if scholarship.id == scholarship_id.clone() {
                if scholarship.available_grants < students.clone().len() as u64 {
                    panic!("Not enough grants available");
                }
                if &caller != &scholarship.admin {
                    panic!("Only the scholarship admin can pick students");
                }

                updated_applications = Self::approve_students(
                    env,
                    students.clone(),
                    scholarship_id.clone(),
                    applications.clone(),
                );

                scholarship.available_grants -= students.len() as u64; //TODO actually check this later
                updated_scholarships.push_back(scholarship.clone());
            } else {
                updated_scholarships.push_back(scholarship.clone());
            }
        }
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "scholarships"), &updated_scholarships);

        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "applications"), &updated_applications);
    }

    pub fn get_my_scholarships(env: &Env, address: Address) -> Vec<Scholarship> {
        // * as Admin of scholarship
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
        // * as student
        let applications = Self::get_applications(env);
        let mut my_applications = Vec::new(env);
        for application in applications.iter() {
            if application.applicant == address {
                my_applications.push_back(application.clone());
            }
        }
        return my_applications;
    }

    pub fn get_applications_frm_schlrship(env: &Env, scholarship_id: u64) -> Vec<Application> {
        let applications = Self::get_applications(env);
        let mut scholarship_applications = Vec::new(env);
        for application in applications.iter() {
            if application.scholarship_id == scholarship_id {
                scholarship_applications.push_back(application.clone());
            }
        }
        return scholarship_applications;
    }

    pub fn reject_application(env: &Env, application_id: u64) {
        let applications = Self::get_applications(env);
        let mut updated_applications = Vec::new(env);

        for mut application in applications.iter() {
            if application.id == application_id {
                if application.status != ApplicationStatus::Pending {
                    panic!("Application has already been processed");
                }
                application.status = ApplicationStatus::Rejected;
            }
            updated_applications.push_back(application.clone());
        }
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "applications"), &updated_applications);
    }

    fn validate_application(scholarship: Scholarship, scholarships: Vec<Scholarship>) {
        //check grant amount/validate inputs
        if scholarship.student_grant_amount <= 0 || scholarship.available_grants <= 0 {
            panic!("Total grant amount cannot be negative");
        }
    }

    fn approve_students(
        env: &Env,
        students: Vec<Address>,
        scholarship_id: u64,
        applications: Vec<Application>,
    ) -> Vec<Application> {
        let mut updated_applications = Vec::new(applications.env());
        for student in students.iter() {
            for mut application in applications.iter() {
                if application.applicant == student
                    && application.scholarship_id == scholarship_id
                    && application.status == ApplicationStatus::Pending
                {
                    application.status = ApplicationStatus::Approved;

                    Self::transfer_grants_to_students(env, students.clone(), scholarship_id);
                    //TODO emit some event
                }
                updated_applications.push_back(application);
            }
        }
        updated_applications
    }

    fn transfer_grants_to_students(env: &Env, students: Vec<Address>, scholarship_id: u64) {
        //get scholarships
        //pick scholarship that matches scholarship_id
        let scholarships = Self::get_scholarships(env);
        let scholarship = scholarships
            .iter()
            .find(|scholarship| scholarship.id == scholarship_id)
            .unwrap();

        let token_client = token::Client::new(&env, &scholarship.token);
        for student in students.iter() {
            token_client.transfer(
                &env.current_contract_address(),   // * from
                &student,                          // * to
                &scholarship.student_grant_amount, // * amount
            );
        }
    }
}

mod test;
