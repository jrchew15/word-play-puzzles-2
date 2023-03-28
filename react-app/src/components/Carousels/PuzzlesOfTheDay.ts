export function parseDate(date: string): string {
    const dateArr: number[] = date.split('-').map((x: string): number => +x);
    const dateObj = new Date(dateArr[0], dateArr[1], dateArr[2]);
    const months: { [num: string]: string } = {
        '1': 'Jan',
        '2': 'Feb',
        '3': 'Mar',
        '4': 'Apr',
        '5': 'May',
        '6': 'Jun',
        '7': 'Jul',
        '8': 'Aug',
        '9': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec',
        '0': 'Dec'
    }
    // return dateObj.toUTCString().slice(0, 17)
    return `${months[dateObj.getMonth().toString()]} ${dateObj.getDate().toString()}, ${dateObj.getFullYear().toString()}`
}
