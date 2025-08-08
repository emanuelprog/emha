import type { IndexType } from './indexType';
import type { BatchType } from './batchType';
import type { ChartType } from './chartType';
import type { CommercialModuleType } from './commercialModuleType';
import type { HousingComplexesType } from './housingComplexesType';
import type { LotteryNotesType } from './lotteryNotesType';
import type { PersonType } from './personType';
import type { OperationType } from './operationType';

export interface ContractType {
    id: number;
    number: number;
    sequence: number;
    contractDate: string;
    commercialModule: CommercialModuleType;
    housingComplexes: HousingComplexesType;
    batch: BatchType;
    person: PersonType;
    socialGuarantee: string;
    charge: string;
    nonChargeReason: string;
    lotteryNotes: LotteryNotesType;
    squareMeterValue: string;
    propertyValue: string;
    compensationValue: string;
    financedValue: string;
    chart: ChartType;
    index: IndexType;
    operation: OperationType;
    installmentValue: string;
    entryValue: string;
    chosenInstallmentDueDay: number;
    term: string;
}