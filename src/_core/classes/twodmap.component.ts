export class Twodmap<T> {

    private map: Map<number, Map<number, T>> = new Map();

    forEach(callBack: (item: T, x, y) => any) {
        this.map.forEach((value, x) => {
            value.forEach((value2, y) => {
                return callBack(value2, x, y);
            });
        });
    }

    get(x: number, y: number): T {
        try {
            return this.map.get(x).get(y);
        } catch (Exception) {
            return null;
        }
    }

    set(x: number, y: number, item: T): void {
        if (item === null || item === undefined) {
            throw new Error("item undefined");
        }

        if (!this.map.has(x)) {
            this.map.set(x, new Map());
        }
        this.map.get(x).set(y, item);
    }
}
