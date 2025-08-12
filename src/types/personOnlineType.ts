import type { AddressType } from "./addressType";
import type { ChartType } from "./chartType";
import type { DeficiencyType } from "./deficiencyType";
import type { DependentType } from "./dependentType";
import type { ProfessionType } from "./professionType";

export interface PersonOnlineType {
    id: number | null;
    legacySystemCode: number | null;
    registrationPassword: number | null;
    name: string | null;
    gender: string | null;
    birthDate: string | null;
    maritalStatus: ChartType | null;
    motherName: string | null;
    fatherName: string | null;
    nationality: string | null;
    naturalPlace: string | null;
    profession: ProfessionType | null;
    professionalStatus: ChartType | null;
    income: number | null;
    cpf: string | null;
    isWheelchair: boolean | null;
    hasChronicDisease: boolean | null;
    isElderly: boolean | null;
    hasPhysicalDisability: boolean | null;
    deficiency: DeficiencyType | null;
    rg: string | null;
    rgIssuer: string | null;
    rgState: ChartType | null;
    rgIssueDate: string | null;
    nis: string | null;
    spouseName: string | null;
    spouseGender: string | null;
    spouseBirthDate: string | null;
    spouseMotherName: string | null;
    spouseFatherName: string | null;
    spouseCpf: string | null;
    spouseRgNumber: string | null;
    phone: string | null;
    mobile: string | null;
    email: string | null;
    housingType: ChartType | null;
    areaType: ChartType | null;
    housingSituation: ChartType | null;
    rentValue: number | null;
    householdResponsibleGender: string | null;
    residenceTime: number | null;
    residenceTimeType: string | null;
    workNeighborhood: string | null;
    workRegion: string | null;
    wantsApartment: boolean | null;
    wantsHouse: boolean | null;
    wantsTownhouse: boolean | null;
    wantsLand: boolean | null;
    wantsLandAndMaterial: boolean | null;
    createdAt: string | null;
    updatedAt: string | null;
    spouseNis: string | null;
    benefitContractNumber: string | null;
    benefitedConjunto: string | null;
    benefitBlockNumber: string | null;
    benefitBlockCode: string | null;
    benefitLotNumber: string | null;
    benefitLotCode: string | null;
    benefitModule: string | null;
    isSpouseDependent: boolean | null;
    spouseNationality: string | null;
    contactPhone: string | null;
    projectId: number | null;
    programId: number | null;
    updatedViaKattle: boolean | null;
    socialName: string | null;
    hasChildrenUnder14: boolean | null;
    hasEldersAsDependents: boolean | null;
    isBloodDonor: string | null;
    spouseProfession: ProfessionType | null;
    spouseProfessionStatus: ChartType | null;
    isViolenceVictim: boolean | null;
    contactName: string | null;
    socialNetwork: string | null;
    comonl: string | null;
    caponl: boolean | null;
    liveOrWork3KmFromTheDevelopment: boolean | null;
    ownsProperty: boolean | null;
    dcionl: boolean | null;
    cras: boolean | null;
    creas: boolean | null;
    creditRestrictionFlag: string | null;
    wantsSubsidizedLoan: boolean | null;
    wantsSocialRentFlag: boolean | null;
    formattedIncome: string | null;
    formattedRentValue: string | null;
    ethnicity: string | null;
    indigenousEthnicity: string | null;
    spouseEthnicity: string | null;
    spouseIndigenousEthnicity: string | null;
    livesInVillage: boolean | null;
    isQuilombola: boolean | null;
    hasDisability: boolean | null;
    spouseHasDisability: boolean | null;
    spouseHasWorkLimitingDisease: boolean | null;
    spouseHasDegenerativeDisease: boolean | null;
    hasCancer: boolean | null;
    spouseHasCancer: boolean | null;
    spouseIsElderly: boolean | null;
    hasPrecariousHousing: boolean | null;
    isInCoHousing: boolean | null;
    hasOvercrowding: boolean | null;
    livesInRiskArea: boolean | null;
    hasExcessiveRentBurden: boolean | null;
    receivesRentSubsidy: boolean | null;
    isHomeless: boolean | null;
    hasDegenerativeDisease: boolean | null;
    spouseLivesInVillage: boolean | null;
    spouseIsQuilombola: boolean | null;
    spouseHasChronicDisease: boolean | null;
    sitpreonl: boolean | null;
    isSingleParentFamily: boolean | null;
    addresses: AddressType[] | null;
    dependents: DependentType[] | null;
}

export interface PersonOnlineSummary {
    id: number;
    name: string;
    formattedCpf: string;
    isElderly: string;
    hasDisability: string;
    referenceYear: number;
    status: string;
}

export interface PersonOnlineFilter {
    name: string;
    cpf: string;
    registrationPassword: string;
}

export function createPersonOnlineForm(): PersonOnlineType {
    return {
        id: null,
        legacySystemCode: null,
        registrationPassword: null,
        name: null,
        gender: null,
        birthDate: null,
        maritalStatus: null,
        motherName: null,
        fatherName: null,
        nationality: null,
        naturalPlace: null,
        profession: null,
        professionalStatus: null,
        income: null,
        cpf: null,
        isWheelchair: null,
        hasChronicDisease: null,
        isElderly: null,
        hasPhysicalDisability: null,
        deficiency: null,
        rg: null,
        rgIssuer: null,
        rgState: null,
        rgIssueDate: null,
        nis: null,
        spouseName: null,
        spouseGender: null,
        spouseBirthDate: null,
        spouseMotherName: null,
        spouseFatherName: null,
        spouseCpf: null,
        spouseRgNumber: null,
        phone: null,
        mobile: null,
        email: null,
        housingType: null,
        areaType: null,
        housingSituation: null,
        rentValue: null,
        householdResponsibleGender: null,
        residenceTime: null,
        residenceTimeType: null,
        workNeighborhood: null,
        workRegion: null,
        wantsApartment: null,
        wantsHouse: null,
        wantsTownhouse: null,
        wantsLand: null,
        wantsLandAndMaterial: null,
        createdAt: null,
        updatedAt: null,
        spouseNis: null,
        benefitContractNumber: null,
        benefitedConjunto: null,
        benefitBlockNumber: null,
        benefitBlockCode: null,
        benefitLotNumber: null,
        benefitLotCode: null,
        benefitModule: null,
        isSpouseDependent: null,
        spouseNationality: null,
        contactPhone: null,
        projectId: null,
        programId: null,
        updatedViaKattle: null,
        socialName: null,
        hasChildrenUnder14: null,
        hasEldersAsDependents: null,
        isBloodDonor: null,
        spouseProfession: null,
        spouseProfessionStatus: null,
        isViolenceVictim: null,
        contactName: null,
        socialNetwork: null,
        comonl: null,
        caponl: null,
        liveOrWork3KmFromTheDevelopment: null,
        ownsProperty: null,
        dcionl: null,
        cras: null,
        creas: null,
        creditRestrictionFlag: null,
        wantsSubsidizedLoan: null,
        wantsSocialRentFlag: null,
        formattedIncome: null,
        formattedRentValue: null,
        ethnicity: null,
        indigenousEthnicity: null,
        spouseEthnicity: null,
        spouseIndigenousEthnicity: null,
        livesInVillage: null,
        isQuilombola: null,
        hasDisability: null,
        spouseHasDisability: null,
        spouseHasWorkLimitingDisease: null,
        spouseHasDegenerativeDisease: null,
        hasCancer: null,
        spouseHasCancer: null,
        spouseIsElderly: null,
        hasPrecariousHousing: null,
        isInCoHousing: null,
        hasOvercrowding: null,
        livesInRiskArea: null,
        hasExcessiveRentBurden: null,
        receivesRentSubsidy: null,
        isHomeless: null,
        hasDegenerativeDisease: null,
        spouseLivesInVillage: null,
        spouseIsQuilombola: null,
        spouseHasChronicDisease: null,
        sitpreonl: null,
        isSingleParentFamily: null,
        addresses: [],
        dependents: []
    };
}