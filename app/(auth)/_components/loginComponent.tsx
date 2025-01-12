"use client";
import React from 'react';
import UserAuthForm from "./user-auth-form";

type LoginViewProps = {
    onSwitch: () => void;
};

// export default function LoginComponent({ onSwitch }: LoginViewProps) {
const LoginComponent: React.FC<LoginViewProps> = ({ onSwitch }) => {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Login to account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to login into your account
                </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                {`Don't have an account?`}{' '}
                <button
                    onClick={onSwitch}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Create an account
                </button>{' '}
            </p>
        </>
    )
}

export default LoginComponent;