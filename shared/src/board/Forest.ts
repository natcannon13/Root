import { Location, type LocationID } from './Location';

export class Forest extends Location {
    id: LocationID;

    constructor(id: LocationID) {
        super();
        this.id = id;
    }
}
