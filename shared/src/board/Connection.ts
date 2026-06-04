import type { ConnectionType } from '../Enums';
import type { LocationID } from './Location';

export type ConnectionID = number;

export interface Connection {
    id: ConnectionID;
    locationIDs: [LocationID, LocationID];
    type: ConnectionType;
}
