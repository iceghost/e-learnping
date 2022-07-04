import {
    type AnyStateMachine,
    type InterpreterFrom,
    type StateFrom,
} from 'xstate';
import { Readable } from 'svelte/store';

type Prop<T, K> = K extends keyof T ? T[K] : never;

export type UseMachineReturn<
    TMachine extends AnyStateMachine,
    TInterpreter = InterpreterFrom<TMachine>
> = {
    state: Readable<StateFrom<TMachine>>;
    send: Prop<TInterpreter, 'send'>;
    service: TInterpreter;
};
