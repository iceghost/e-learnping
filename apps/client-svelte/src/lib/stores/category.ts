import { browser } from '$app/env';
import { db } from '$lib/db';
import { get, writable } from 'svelte/store';
import type { MyDB } from '$lib/db';

export const categories = writable<MyDB['categories']['value'][]>([], (set) => {
    const unsubscribe = db.subscribe(async ($db) => {
        if (!$db || !browser) return Promise.race([]);
        const categories = [];
        for await (const cursor of $db
            .transaction('categories')
            .store.index('by-semester')
            .iterate(null, 'prev')) {
            categories.push(cursor.value);
        }
        set(categories);
    });
    return unsubscribe;
});

// export const categories = derived([db, lastUpdated], async ([$db]) => {

//     return categories;
// });

export async function updateCategory(coursecategory: string, hidden: boolean) {
    const $db = get(db);
    const category = await $db.get('categories', coursecategory);
    await $db.put('categories', { ...category!, hidden });
}

export {};
