import ApiClient from '../ApiClient';
import ExchangeYearDocument, { Year } from '../Interfaces/ExchangeYearDocument';
import ExchangeDay from './ExchangeDay';

export default class ExchangeYear {
    
    /**
     * Exchange document.
     */
    protected readonly data: ExchangeYearDocument;
    
    /**
     * Exchange Year document.
     */
    public constructor(data: ExchangeYearDocument) {
        this.data = data;
    }
    
    /**
     * Exchange days for the current exchange document.
     */
    public get days() {
        return this.data.DataSet.Body[0].Cube.map((cube) => new ExchangeDay(cube));
    }
    
    /**
     * Year of the current exchange rate document.
     */
    protected get year() {
        return this.days[0].date.getFullYear();
    }
    
    public static async for(date: { year: Year }): Promise<ExchangeYear> {
        return new this(await ApiClient.getXMLForYear(date.year));
    }
    
    /**
     * Fetch exchange rates for the given date.
     */
    public getDay(date: Date) {
        return this.days.find((exchange) => {
            return exchange.date.toDateString() === date.toDateString();
        });
    }
    
    /**
     * Whether or not the given date is within the same year as the current exchange year document.
     */
    public sameYear(date: Date) {
        return date.getFullYear() === this.year;
    }
    
}