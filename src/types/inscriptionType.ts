import type { EventComponentType } from "./eventComponentType";
import type { PersonOnlineType } from "./personOnlineType";

export interface InscriptionType {
    id: number | null;
    personOnline: PersonOnlineType | null;
    eventComponent: EventComponentType | null;
    registrationProtocol: string | null;
    changeUser: string | null;
    active: boolean | null;
    updatedAt: Date | null;
}
