import { wordgon } from "../classes/wordgonTypes";

export function lettersParse(letters: string) {
    const lettersArr = letters.split('');
    const up = lettersArr.slice(0, 3);
    const right = lettersArr.slice(3, 6);
    const down = lettersArr.slice(6, 9).reverse();
    const left = lettersArr.slice(9).reverse();

    return { up, left, right, down }
}

export const color_dict = {
    '0': '#fdb515',
    '1': '#d36135',
    '2': '#58bc82',
    '3': '#0d3b66',
    '4': '#e84855',
    '5': '#3ABEFF',
    'easy': '#58bc82',
    'medium': '#3ABEFF',
    'hard': '#e84855'
}

export function puzzleDifficulty(puzzle: wordgon) {
    let tries = puzzle.numAttempts;
    switch (tries) {
        case 6:
            return 'easy'
        case 7:
            return 'medium'
        case 8:
            return 'hard'
        case 9:
            return 'hard'
        default:
            return 'medium'
    }
}

export function dbDateToDateObj(db_date: string) {
    let arr = db_date.split('-')
    return new Date(+arr[0], +arr[1] - 1, +arr[2])
}
