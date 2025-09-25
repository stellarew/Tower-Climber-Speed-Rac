// utils/json.ts
export function stringify(data: any): string {
    return JSON.stringify(data, (_, value) => {
        if (typeof value === 'bigint') {
            return value.toString() + 'n';
        }
        return value;
    });
}

export function parse(json: string): any {
    return JSON.parse(json, (_, value) => {
        if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
            return BigInt(value.slice(0, -1));
        }
        return value;
    });
}
