"use client";
import { Scholarship } from "bindings";
import React from "react";

const createScholarshipPage = () => {
  const [scholarship, setScholarship] = React.useState<Scholarship>();

  return (
    <>
      <div className="flex justify-center items-start mt-32">
        <h2 className="font-extrabold text-5xl">Create new Stellarship</h2>
      </div>
      <div className="flex justify-center items-start mt-12">
        <div className="card bg-neutral text-neutral-content w-96">
          <div className="card-body items-center text-center">
            <form className="place-content-center ">
              <input
                type="text"
                placeholder="Stellarship Name"
                className="input input-bordered w-full max-w-xs m-2"
                value={scholarship?.name}
              />

              <input
                type="text"
                placeholder="Stellarship Details"
                className="input input-bordered w-full max-w-xs m-2"
                value={scholarship?.details}
              />

              <input
                type="text"
                placeholder="Available Grants"
                className="input input-bordered w-full max-w-xs m-2"
                value={scholarship?.available_grants.toString()}
              />

              <input
                type="text"
                placeholder="Total Grant Amount"
                className="input input-bordered w-full max-w-xs m-2"
                value={scholarship?.total_grant_amount.toString()}
              />

              <input
                type="text"
                placeholder="End Date"
                className="input input-bordered w-full max-w-xs m-2"
                value={scholarship?.end_date.toString()}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
// export interface Scholarship {
//   available_grants: u32;
//   details: string;
//   end_date: u64;
//   name: string;
//   total_grant_amount: i128;
// }

export default createScholarshipPage;
