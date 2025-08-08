import type { CommercialModuleType } from "./commercialModuleType";

export interface EventComponentType {
    id: number;
    commercialModule: CommercialModuleType;
    housingComplexId: number;
    housingQuantity: number;
    description: string;
}
