export enum IntegrityMode {
    NONE = 'NONE',
    SIZE = 'SIZE', //default
    SHA256 = 'SHA256'     
}

export interface IntegrityMetadata {
    size: number;
    hash?: string|undefined;
}