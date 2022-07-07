/// <reference types="@sveltejs/kit" />
import { DBInstance, DBCourse, type DBContent, type DBModule, type DBUpdate } from '$lib/stores/db';
import { createCoursesStore } from '$lib/stores/courses';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		// interface Locals {}
		// interface Platform {}
		// interface Session {}
		interface Stuff {
			token: string;
			db: DBInstance;
			courses: DBCourse[];
			course: DBCourse;
			content: DBContent;
			module: DBModule;
			updates: DBUpdate[];
		}
	}
}
