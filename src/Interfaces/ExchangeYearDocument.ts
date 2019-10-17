import { CurrencyCode } from './ExchangeInterface';

interface ExchangeCube {
    $: {
        date: string;
    },
    Rate: Array<{
        $: {
            currency: CurrencyCode;
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