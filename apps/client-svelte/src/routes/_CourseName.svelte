<script lang="ts">
    import type { Course } from 'moodle';

    export let course: Course;

    // split
    const regex = /^(.*)\W*\((.*)\)\W*\_(.*)\W*(?:\((.*)\))?$/;

    $: matches = regex.exec(course.fullname.trim());

    $: parsed = !matches
        ? null
        : {
              name: matches[1],
              code: matches[2],
              class: matches[3],
              semester: matches[4] || null,
          };
</script>

<a href="/course/{course.id}">
    {#if parsed === null}
        {course.fullname}
    {:else}
        {parsed.code} - {parsed.name}
    {/if}
</a>
