import React from "react";

export interface ScholarShip {
  id: number;
  name: string;
  amount: number;
  deadline: string;
  description: string;
  quantity: number;
  isAvaliable?: boolean;
}

const scholarships = () => {
  const scholarships = [
    {
      id: 1,
      name: "Academic Excellence Scholarship",
      amount: 20000,
      deadline: "2024-12-31",
      description:
        "A scholarship for high school seniors based on academic excellence, leadership, and service.",
      quantity: 10,
    },
    {
      id: 2,
      name: "Low-Income Student Scholarship",
      amount: 40000,
      deadline: "2025-01-15",
      description:
        "A scholarship for low-income students pursuing undergraduate studies.",
      quantity: 20,
    },
    {
      id: 3,
      name: "STEM Graduate Scholarship",
      amount: 30000,
      deadline: "2025-02-28",
      description: "A scholarship for graduate students in STEM fields.",
      quantity: 5,
    },
  ];

  return (
    <>
      <div className="flex justify-center items-start">
        <h1 className="m-12 font-extrabold text-5xl">Stellarships</h1>
      </div>
      <br />

      <div className="overflow-x-auto flex justify-center items-start h-screen">
        <table className="bg-primary-content table max-w-xl">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Amount</th>
              <th>DeadLine</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((_scholarship) => (
              <tr>
                <>
                  <th></th>
                  <th>{_scholarship.name}</th>
                  <td>{_scholarship.amount}$</td>
                  <td>{_scholarship.deadline}</td>
                  <td>
                    <button className="btn btn-accent btn-sm">apply</button>
                  </td>
                </>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default scholarships;
