import { browser } from '$app/env';
import { db, type MyDB } from '$lib/db';
import { derived, writable } from 'svelte/store';
import type { DBCourse } from './course';

type DBSection = MyDB['sections']['value'];
type DBModule = MyDB['modules']['value'];
type DBUpdate = MyDB['updates']['value'];

export const currentCourseId = writable<number>();

export const sections = writable<Array<DBSection>>([], (set) => {
    return derived([db, currentCourseId], (i) => i).subscribe(
        async ([$db, $current]) => {
            if (!$db || !browser || !$current) return;
            const sections = await $db
                .transaction('sections')
                .store.index('by-courseid')
                .getAll($current);
            set(sections);
        }
    );
});

export const modules = writable<
    Array<{
        section: DBSection;
        moduleUpdates: { module: DBModule; updates: DBUpdate[] }[];
    }>
>([], (set) => {
    return derived([db, sections], (i) => i).subscribe(
        async ([$db, $sections]) => {
            const result = await Promise.all(
                $sections.map(async (section) => {
                    const modules = await getModules(section);
                    return {
                        section,
                        moduleUpdates: await Promise.all(
                            modules.map(async (module) => ({
                                module,
                                updates: await getUpdates(module),
                            }))
                        ),
                    };
                })
            );

            set(result);

            async function getModules(section: DBSection) {
                return await $db
                    .transaction('modules')
                    .store.index('by-sectionid')
                    .getAll(section.section.id);
            }

            async function getUpdates(module: DBModule) {
                return await $db
                    .transaction('updates')
                    .store.getAll(
                        IDBKeyRange.bound(
                            [module.module.id],
                            [module.module.id, new Date()]
                        )
                    );
            }
        }
    );
});

