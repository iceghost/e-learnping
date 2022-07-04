import { add, differenceInSeconds } from 'date-fns';

export function addRandom(date: Date | number, duration: Duration) {
    const newDate = add(date, duration);
    let seconds = differenceInSeconds(newDate, date);
    seconds = -Math.log(Math.random()) * seconds;
    return add(date, { seconds });
}
