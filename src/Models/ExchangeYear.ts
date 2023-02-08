import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import { XMLParsingError } from '../Errors/BNRError';
import ExchangeYearDocument from '../Interfaces/ExchangeYearDocument';
import ExchangeDay from './ExchangeDay';

const ApiClient = Axios.create({
    baseURL: 'https://www.bnr.ro/files/xml/years/',
});

export default class ExchangeYear {
    
    public static fromDate(date: Date) {
        return ApiClient.get(`nbrfxrates${date.getFullYear()}.xml`).then(async (response) => {
            const parsedXml = await ParseXML(response.data).catch((error: Error) => {
                throw new XMLParsingError('Unable to parse response from BNR!', error)
            });
            
            return new this(parsedXml);
        });
    }

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