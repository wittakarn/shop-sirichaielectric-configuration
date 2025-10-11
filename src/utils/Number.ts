export const numberWithCommas = (num: number, decimal: number = 2): string => {
    return num.toFixed(decimal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const round = (num: number, decimal: number = 2): number => {
    const roundedString = num.toFixed(decimal);
    return parseFloat(roundedString);
}