import { setContext, getContext } from 'svelte';

export function defineContext<T>(
    key: string | Symbol = Symbol()
): [() => T, (service: T) => T] {
    return [
        () => getContext(key) as T,
        (service: T) => {
            setContext(key, service);
            return service;
        },
    ];
}
