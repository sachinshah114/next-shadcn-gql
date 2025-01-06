import { useQuery, useMutation, OperationVariables, MutationFunction, ApolloError } from '@apollo/client';

export const useCustomQuery = <
    TData = any,
    TVariables extends OperationVariables = Record<string, any>
>(
    query: any,
    variables?: TVariables
): {
    data: TData | null;
    error: ApolloError | null;
    loading: boolean;
} => {
    const { data, error, loading } = useQuery<TData, TVariables>(query, {
        variables,
    });

    return { data: data || null, error, loading };
};

export const useCustomMutation = <
    TData = any,
    TVariables extends OperationVariables = Record<string, any>
>(
    mutation: any
): {
    mutate: MutationFunction<TData, TVariables>;
    data: TData | null;
    error: ApolloError | null;
} => {
    const [mutateFunction, { data, error }] = useMutation<TData, TVariables>(mutation);

    const noop: MutationFunction<TData, TVariables> = () => Promise.resolve({} as any);

    return {
        mutate: error ? noop : mutateFunction,
        data: data || null,
        error,
    };
};