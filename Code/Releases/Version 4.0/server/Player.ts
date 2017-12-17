export class Player {
    x = 400;
    y = 400;
    r = 0;
    name;
    id;
    health = 20;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
