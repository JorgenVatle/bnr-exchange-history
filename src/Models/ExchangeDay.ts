import { ExchangeCube } from '../Interfaces/ExchangeYearDocument';
import { CurrencyCode, ExchangeInterface, ExchangeRate } from '../Interfaces/ExchangeInterface';

export default class ExchangeDay {

    /**
     * Exchange Day data.
     */
    protected readonly data: ExchangeCube;

    /**
     * Exchange Day constructor.
     */
    public constructor(data: ExchangeCube) {
        this.data = data;
    }

    /**
     * Formatted exchange object.
     */
    public get object(): ExchangeInterface {
        const result: Partial<{ [Key in CurrencyCode]: ExchangeRate }> = {};

        this.data.Rate.forEach((rate) => {
            result[rate.$.currency] = {
                name: rate.$.currency,
                rate: parseFloat(rate._),
                multiplier: parseInt(rate.$.multiplier || '1')
            }
        });

        return <ExchangeInterface>result;
    }

    /**
     * Exchange date.
     */
    public get date(): Date {
        return new Date(this.data.$.date);
    }

}