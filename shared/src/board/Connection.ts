import type { ConnectionType } from '../Enums';

export interface Connection {
    id: number;
    locationIDs: [number, number];
    type: ConnectionType;
}
