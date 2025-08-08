export interface DebtType {
    id: number;
    contractId: number;
    personId: number;
    taxTypeId: number;
    installmentNumber: number;
    dueDate: string;
    originalValueFormatted: string;
    discountFormatted: string;
    valueWithDiscount: string;
    interestFormatted: string;
    fineFormatted: string;
    additionalFormatted: string;
    totalFormatted: string;
    paymentValueFormatted: string;
    paymentDate: string;
    color: string;
    bonus: boolean;
    bonusYear: number;
}
