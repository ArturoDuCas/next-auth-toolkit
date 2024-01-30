import React from 'react';
import NewPasswordForm from "@/components/auth/newPasswordForm";
import {CardWrapper} from "@/components/auth/cardWrapper";

const NewPasswordPage = () => {
  return (
      <CardWrapper
          headerLabel="Enter a new password"
          backButtonLabel="Back to login"
          backButtonHref="/auth/login"
      >
        <NewPasswordForm />
      </CardWrapper>
  );
};

export default NewPasswordPage;