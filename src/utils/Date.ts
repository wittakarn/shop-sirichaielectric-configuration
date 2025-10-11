export const formatToDmy = (dateString: string) => {
    if (dateString) {
        const datePart = dateString.split('-');
        return `${datePart[2]}\/${datePart[1]}\/${datePart[0]}`;
    }
    return '';
}

export const formatToDmyt = (datetimeString: string) => {
    if (datetimeString) {
        const dateTimePart = datetimeString.split(' ');
        const dateString = formatToDmy(dateTimePart[0]);
        if (dateTimePart.length > 1) {
            return `${dateString} ${dateTimePart[1]}`;
        } else {
            return dateString;
        }
    }
    return '';
}

export const convertDateGmtToUtc = (dateGmt: Date) => {
    return new Date(Date.UTC(dateGmt.getFullYear(), dateGmt.getMonth(), dateGmt.getDate(), dateGmt.getHours(), dateGmt.getMinutes()))
}
