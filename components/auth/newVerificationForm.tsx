"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import {NewVerification} from "@/actions/newVerification";

import {CardWrapper} from "@/components/auth/cardWrapper";
import FormError from "@/components/formError";
import FormSuccess from "@/components/formSuccess";
import {BarLoader} from "react-spinners";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!")
      return;
    }

    NewVerification(token)
        .then((data) => {
          setSuccess(data.success);
          setError(data.error);
        })
        .catch((err) => {
          setError("Something went wrong!");
        });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
      <CardWrapper
          headerLabel="Confirming your verification"
          backButtonLabel="Back to login"
          backButtonHref="/auth/login"
      >
        <div className="flex justify-center items-center w-full">
          {!success && !error && <BarLoader/>}
          <FormSuccess message={success}/>
          <FormError message={error}/>


        </div>

      </CardWrapper>
  );
};

export default NewVerificationForm;