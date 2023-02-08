export class BNRError extends Error {
}

export class XMLParsingError extends BNRError {
    constructor(
        public readonly message: string,
        public readonly cause: Error,
        public readonly metadata: Record<string, any>,
    ) {
        super(message);
        this.stack += `\n\nCaused by:\n\n${cause.stack}`;
    }
}