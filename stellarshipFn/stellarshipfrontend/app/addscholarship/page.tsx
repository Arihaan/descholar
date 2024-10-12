import { FieldValues, useForm } from "react-hook-form";
import React from "react";

const createScholarshipPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}></form>
    </>
  );
};

export default createScholarshipPage;
