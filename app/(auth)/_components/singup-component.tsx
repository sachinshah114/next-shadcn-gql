"use client";
import React from 'react';
import UserSignUpForm from './user-signup-form';
import Link from 'next/link';

type SignupComponentProps = {
    onSwitch: () => void;
};

const SignupComponent: React.FC<SignupComponentProps> = ({ onSwitch }) => {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details below to create your account
                </p>
            </div>
            <UserSignUpForm setIsLogin={onSwitch} />
            <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                    onClick={onSwitch}
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Login
                </button>
            </p>
            <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </Link>
                .
            </p>
        </>
    );
};

export default SignupComponent;