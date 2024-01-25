import React from 'react';
import { CardWrapper } from "@/components/auth/cardWrapper";
import {RegisterForm} from "@/components/auth/registerForm";

const RegisterPage = () => {
    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/login"
            showSocial
        >
            <RegisterForm />
        </CardWrapper>
    );
};

export default RegisterPage;