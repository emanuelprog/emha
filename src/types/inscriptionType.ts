import type { EventComponentType } from "./eventComponentType";
import type { PersonOnlineType } from "./personOnlineType";

export interface InscriptionType {
    id: number;
    personOnline: PersonOnlineType;
    eventComponent: EventComponentType;
    registrationProtocol: string;
    changeUser: string;
    active: boolean;
    updatedAt: Date
}
