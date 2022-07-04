/// <reference types="@sveltejs/kit" />
import type { Info } from 'moodle';
import type { DBInstance } from '$lib/db';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    declare namespace App {
        // interface Locals {}
        // interface Platform {}
        interface Session {
            db: DBInstance;
            token: string;
            info: Info;
        }
        // interface Stuff {}
    }
}
