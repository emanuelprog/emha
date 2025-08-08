import type { CommercialModuleType } from "./commercialModuleType";
import type { HousingComplexesType } from "./housingComplexesType";

export interface PersonType {
    id: number;
    cpf: string;
    name: string;
}

export interface PersonSummaryType {
    id: number;
    formattedCpf: string;
    name: string;
    isBenefited: string;
    status: string;
    commercialModule: CommercialModuleType;
    housingComplexesList: HousingComplexesType[];
}

export interface PersonFilter {
    name: string;
    cpf: string;
}  