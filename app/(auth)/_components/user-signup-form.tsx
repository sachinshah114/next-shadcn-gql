"use client";
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CREATE_USER_MUTATION } from '@/utils/mutations';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    name: z.string().min(1, { message: 'Name is required' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Enter a valid phone number' })

});

type UserFormValues = z.infer<typeof formSchema>;

export default function UserSignUpForm() {
    const [loading, startTransition] = useTransition();

    const [CreateUser] = useMutation(CREATE_USER_MUTATION);

    const defaultValues: Partial<UserFormValues> = {
        email: '',
        name: '',
        password: '',
        phone: ''
    };
    const form = useForm<UserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            const response = await CreateUser({
                variables: {
                    input: {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        phone: data.phone,
                    },
                },
            });

            console.log(`[response] ::: `, response);

            if (response.errors) {
                toast.error(response.errors ? response.errors[0].message : 'Signup failed!');
            } else if (response.data?.createUser) {
                toast.success('Account created successfully!');

                //reset Form
                form.reset();
            } else {
                toast.error('Unexpected error. Please try again.');
            }
        } catch (error: any) {
            const errorMessage = error.message.replace(/^ApolloError:\s*/, '');
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-2"
                >
                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Field */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your phone number"
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {/* Submit Button */}
                    <Button disabled={loading} className="ml-auto w-full" type="submit">
                        Sign Up
                    </Button>
                </form>
            </Form>
        </>
    );
}
