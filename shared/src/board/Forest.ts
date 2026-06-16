import { Location, type LocationID } from "./Location";

export class Forest extends Location {
    id: LocationID;

    type: "forest" = "forest";

    constructor(id: LocationID) {
        super();
        this.id = id;
    }
}

export function isForest(location: Location): location is Forest {
    return location.type === "forest";
}