import React from 'react';
import ResetForm from "@/components/auth/resetForm";
import {CardWrapper} from "@/components/auth/cardWrapper";

const ResetPage = () => {
  return (
      <CardWrapper
          headerLabel="Forgot your password?"
          backButtonLabel="Back to login"
          backButtonHref="/auth/login"
      >
        <ResetForm />
      </CardWrapper>
  );
};

export default ResetPage;