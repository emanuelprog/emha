export interface DependentType {
    id: number;
    totalDependents: number;
    under14: number;
    over60: number;
    totalWithDisability: number;
    hasWheelchairDependent: boolean;
    hasMotorDisability: boolean;
    hasPhysicalDisability: boolean;
    hasHearingDisability: boolean;
    hasVisualDisability: boolean;
    hasMultipleDisabilities: boolean;
    hasOtherDisabilities: boolean;
    descriptionOfDisabilities: string;
    dependentsWithDisabilitiesNames: string;
    totalChronicDiseases: number;
    hasMentalDisability: boolean;
    hasMicrocephaly: boolean;
    hasDisablingChronicDisease: boolean;
    hasCancer: boolean;
    hasDegenerativeDisease: boolean;
}