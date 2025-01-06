"use client";

import { useCustomQuery } from '../../../utils/graphqlHelpers';
import { GET_TEST_DATA } from '../../../utils/queries';
export type TestQueryData = {
    testQueryData: {
        id: string;
        name: string;
    }[];
};
export default function Page() {
    const { data, loading, error } = useCustomQuery<TestQueryData>(GET_TEST_DATA);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div>
                    <h1>Users' List</h1>
                    <ul>
                        {data?.testQueryData.map((user) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}