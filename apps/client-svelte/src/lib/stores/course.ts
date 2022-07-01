import { db, type MyDB } from '$lib/db';
import { derived, writable } from 'svelte/store';
import { categories } from './category';

export const courses = writable<Record<string, MyDB['courses']['value'][]>>(
    {},
    (set) => {
        derived([db, categories], (i) => i).subscribe(
            async ([$db, $categories]) => {
                const courses = await Promise.all(
                    $categories.map(async ({ coursecategory }) => {
                        const courses = await $db
                            .transaction('courses')
                            .store.index('by-category-and-code')
                            .getAll(
                                IDBKeyRange.bound(
                                    [coursecategory, ''],
                                    [coursecategory, 'ZZ9999']
                                )
                            );
                        return [coursecategory, courses] as const;
                    })
                );
                set(Object.fromEntries(courses));
            }
        );
    }
);
