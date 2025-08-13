export interface DependentType {
    id: number | null;
    totalDependents: number | null;
    under14: number | null;
    over60: number | null;
    totalWithDisability: number | null;
    hasWheelchairDependent: boolean | null;
    hasMotorDisability: boolean | null;
    hasPhysicalDisability: boolean | null;
    hasHearingDisability: boolean | null;
    hasVisualDisability: boolean | null;
    hasMultipleDisabilities: boolean | null;
    hasOtherDisabilities: boolean | null;
    descriptionOfDisabilities: string | null;
    dependentsWithDisabilitiesNames: string | null;
    totalChronicDiseases: number | null;
    hasMentalDisability: boolean | null;
    hasMicrocephaly: boolean | null;
    hasDisablingChronicDisease: boolean | null;
    hasCancer: boolean | null;
    hasDegenerativeDisease: boolean | null;
}

export function createDefaultDependent(): DependentType {
    return {
        id: null,
        totalDependents: null,
        under14: null,
        over60: null,
        totalWithDisability: null,
        hasWheelchairDependent: null,
        hasMotorDisability: null,
        hasPhysicalDisability: null,
        hasHearingDisability: null,
        hasVisualDisability: null,
        hasMultipleDisabilities: null,
        hasOtherDisabilities: null,
        descriptionOfDisabilities: null,
        dependentsWithDisabilitiesNames: null,
        totalChronicDiseases: null,
        hasMentalDisability: null,
        hasMicrocephaly: null,
        hasDisablingChronicDisease: null,
        hasCancer: null,
        hasDegenerativeDisease: null
    };
}