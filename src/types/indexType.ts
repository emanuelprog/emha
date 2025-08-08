import type { ChartType } from "./chartType";

export interface IndexType {
    id: number;
    referenceDate: string;
    chart: ChartType;
    salaryValue: string;
    maxAboveSalary: string;
    minAboveSalary: string;
    contractEntryRequirement: string;
    year: number;
    discountPercentage: string;
    firstInstallmentPeriod: string;
    annualAdjustment: string;
    funafDiscount: string;
    minimumPropertyImplantationDiscount: string;
    maximumPropertyImplantationDiscount: string;
    discountStartDate: string;
    discountEndDate: string;
    minContractValueForDiscount: string;
    maxContractValueForDiscount: string;
}
