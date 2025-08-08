import type { HousingComplexesType } from './housingComplexesType';

export interface BatchType {
    id: number;
    housingComplexes: HousingComplexesType;
    block: number;
    description: string;
    address: string;
    addressNumber: number;
}