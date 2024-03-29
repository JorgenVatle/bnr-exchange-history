import { CurrencyCode } from './ExchangeRate';

export interface ExchangeCube {
    $: {
        date: string;
    },
    Rate: Array<{
        $: {
            currency: CurrencyCode;
            multiplier?: '1' | '100';
        }
        _: string; // Exchange rate.
    }>
}

export default interface ExchangeYearDocument {
    DataSet: {
        $: {
            xmlns: string;
            cmlns: string;
            'xsi:schemaLocation': string;
        };
        Header: {
            Publisher: ['National Bank of Romania'];
            PublishingDate: [string];
            MessageType: ['DR'];
        },
        Body: Array<{
            Subject: ['Reference rates'];
            OrigCurrency: ['RON'];
            Cube: ExchangeCube[],
        }>
    }
}
export type Year = number;