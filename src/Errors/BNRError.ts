import { AxiosResponse } from 'axios';
import { Year } from '../Interfaces/ExchangeYearDocument';

export class BNRError extends Error {
    public readonly metadata?: ReturnType<typeof parseMetadata>;
    
    constructor(
        public readonly message: string,
        metadata?: RequestMetadata,
    ) {
        super(message);
        
        if (metadata) {
            this.metadata = parseMetadata(metadata);
        }
        
        if (metadata?.cause) {
            this.stack += `\n\nCaused by:\n\n${metadata.cause.stack}`;
        }
    }
}


interface RequestMetadata {
    response: AxiosResponse;
    cause?: Error;
    year: Year;
}

function parseMetadata({ response, year }: RequestMetadata) {
    return {
        path: response.config.url,
        baseUrl: response.config.baseURL,
        status: `${response.status} ${response.statusText}`,
        response: response.data,
        requestedYear: year,
        contentType: response.headers['content-type'],
    };
}

export class InvalidBNRResponse extends BNRError {
    constructor(message: string, metadata: RequestMetadata) {
        super(message, metadata);
    }
}

export class XMLParsingError extends BNRError {
    constructor(message: string, metadata: RequestMetadata) {
        super(message, metadata);
    }
}