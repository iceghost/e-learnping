import { Classification, Client, Module, Update } from 'moodle';
import { Course } from 'moodle/dist/courses';
import { startOfISOWeek } from 'date-fns';

export const getAll: ExportedHandlerFetchHandler<Env> = async (
    req,
    env,
    ctx
) => {
    const moodle = new Client(env.ELEARNING_TOKEN);
    let courses = await moodle.getEnrolledCourses(Classification.INPROGRESS);
    // courses = courses.slice(-10);

    let { readable, writable } = new TransformStream();

    const promises = Object.fromEntries(
        courses
            .map(async (course, i) => {
                const res = await moodle.getUpdatesAndModules(
                    course.id,
                    startOfISOWeek(new Date())
                );
                console.log('done', course.id);
                return [course, res, i] as const;
            })
            .map((promise, i) => [i, promise])
    );

    ctx.waitUntil(
        (async () => {
            let countdown = courses.length;
            const writer = writable.getWriter();
            while (countdown != 0) {
                const [course, res, i] = await Promise.race(
                    Object.values(promises)
                );
                await writer.ready;
                await constructSSE(writer, { course, res });
                delete promises[i];
                countdown -= 1;
            }
            await writer.ready;
            await writer.close();
        })()
    );

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
        },
    });
};

async function constructSSE(writer: WritableStreamDefaultWriter, data: any) {
    let encoder = new TextEncoder();
    await writer.write(
        encoder.encode('data: ' + JSON.stringify(data) + '\n\n')
    );
}
