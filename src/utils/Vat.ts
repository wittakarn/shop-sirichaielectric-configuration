export const getVatRate = (customerGrade: string): number => {
    if (customerGrade === "a" || customerGrade === "b" || customerGrade === "c" || customerGrade === "d") {
			return 0
		}
    return application.thaiVat / 100;
}