import React from 'react';
import {LoginForm} from "@/components/auth/loginForm";
import { CardWrapper } from "@/components/auth/cardWrapper";

const LoginPage = () => {
    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <LoginForm />
        </CardWrapper>
    );
};

export default LoginPage;