import { db, type MyDB } from '$lib/db';
import { derived, writable } from 'svelte/store';
import { categories, type DBCategory } from './category';

export type DBCourse = MyDB['courses']['value'];

export const courses = writable<
    Array<{
        category: DBCategory;
        courses: DBCourse[];
    }>
>([], (set) => {
    return derived([db, categories], (i) => i).subscribe(
        async ([$db, $categories]) => {
            const courses = await Promise.all($categories.map(getCourses));
            set(courses);

            async function getCourses(category: DBCategory) {
                const courses = [];
                for await (const cursor of $db
                    .transaction('courses')
                    .store.index('by-category-and-code')
                    .iterate(
                        IDBKeyRange.lowerBound([category.coursecategory])
                    )) {
                    if (cursor.key[0] !== category.coursecategory) break;
                    courses.push(cursor.value);
                }
                return { category, courses };
            }
        }
    );
});
