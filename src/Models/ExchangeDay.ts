import { ExchangeCube } from '../Interfaces/ExchangeYearDocument';
import { CurrencyCode, ExchangeRate, ExchangeRates } from '../Interfaces/ExchangeRate';

export default class ExchangeDay {

    /**
     * Exchange Day data.
     */
    protected readonly rawData: ExchangeCube;

    /**
     * Exchange Day constructor.
     */
    public constructor(data: ExchangeCube) {
        this.rawData = data;
    }

    /**
     * Formatted exchange object.
     */
    public get rates(): ExchangeRates {
        const list = this.rawData.Rate.map((entry): [CurrencyCode, ExchangeRate] => {
            const rate: ExchangeRate = {
                name: entry.$.currency,
                rate: parseFloat(entry._),
                multiplier: parseInt(entry.$.multiplier || '1')
            };
            
            
            return [rate.name, rate];
        });
        
        return Object.fromEntries(list) as ExchangeRates;
    }

    /**
     * Exchange date.
     */
    public get date(): Date {
        return new Date(this.rawData.$.date);
    }

}