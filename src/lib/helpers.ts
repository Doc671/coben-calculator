export function getOrdinalPostfix(number: number) {
    if (number > 20) {
        number %= 10;
    }

    switch (number) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}
