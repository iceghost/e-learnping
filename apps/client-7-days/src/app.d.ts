/// <reference types="@sveltejs/kit" />
import { DBCourse, type DBContent, type DBModule } from '$lib/stores/db';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		// interface Locals {}
		// interface Platform {}
		// interface Session {}
		interface Stuff {
			course?: DBCourse;
			content?: DBContent;
			module?: DBModule;
		}
	}
}
