import React from 'react';
import {CardWrapper} from "@/components/auth/cardWrapper";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

const ErrorCard = () => {
  return (
      <CardWrapper
        headerLabel="Oops! Something went wrong"
        backButtonLabel="Back to login"
        backButtonHref="/auht/login"
      >
        <div className="w-full flex justify-center items-center">
          <ExclamationTriangleIcon className="text-destructive"/>
        </div>
      </CardWrapper>
  );
};

export default ErrorCard;