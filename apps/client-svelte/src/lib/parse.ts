const courseRegex = /^(.*)\W*\((.*)\)\W*\_([^(]*)\W*(?:\((.*)\))?$/;

/**
 * Parse course name into parts:
 * name (code)_course (semester)
 * If not match, name contains whole name, everything else is empty
 */
export function parseCourseName(name: string) {
    const matches = courseRegex.exec(name.trim());
    return {
        name: (matches && matches[1])?.trim() || name,
        code: (matches && matches[2])?.trim() || '',
        class: (matches && matches[3])?.trim() || '',
        semester: (matches && matches[4])?.trim() || '',
    };
}

// for splitting into Vietnamese and English parts
const translationRegex = /^(.*)\((.*)\)$/;

/**
 * Parse category name into parts:
 * Học kỳ II năm học 2021-2022 (Semester 2 - Academic year 2021-2022)
 * name (translation)
 * If not match, name contains whole name, everything else is empty
 */
export function parseCategory(category: string) {
    const matches = translationRegex.exec(category.trim());
    const name = (matches && matches[1])?.trim() || category;
    const translation = (matches && matches[2])?.trim() || '';
    return { name, translation };
}

const semesterRegex = /kỳ (\w+)[^0-9]*(\d+)\W*-\W*(\d+)\b/;

/**
 * Extract semester from category name
 */
export function getSemester(raw: string) {
    const matches = semesterRegex.exec(raw.trim());
    if (matches) {
        const deroman = { I: 1, II: 2, III: 3 } as const;
        const semester = deroman[matches[1] as 'I' | 'II' | 'III'];
        const yearFrom = parseInt(matches[2]);
        return (yearFrom - 2000) * 10 + semester;
    }
    return 0; // ko pit
}

export {};
