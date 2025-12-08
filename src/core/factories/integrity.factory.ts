import { PassThrough } from 'stream';
import crypto from 'crypto';
import { IntegrityMode, type IntegrityMetadata } from '../../config/integrity.types.js';


/**
 * Either size or hash
 */
export class IntegrityStreamFactory {
    
    /**
     * 
     * @param mode if no mode passed, use file size check
     * @returns 
     */
    static create(mode: IntegrityMode = IntegrityMode.SIZE) {
        const passThrough = new PassThrough();
        let size = 0;
        let hasher: crypto.Hash | null = null;

        if (mode === IntegrityMode.SHA256) {
            hasher = crypto.createHash('sha256');
        }

        passThrough.on('data', (chunk) => {
            size += chunk.length;
            if (hasher) {
                hasher.update(chunk);
            }
        });

        const resultPromise = new Promise<IntegrityMetadata>((resolve) => {
            passThrough.on('finish', () => {
                resolve({
                    size: size,
                    hash: hasher ? hasher.digest('hex') : undefined
                });
            });
        });

        return {
            stream: passThrough,
            getResult: () => resultPromise
        };
    }
}