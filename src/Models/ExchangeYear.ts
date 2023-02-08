import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import { InvalidBNRResponse, XMLParsingError } from '../Errors/BNRError';
import ExchangeYearDocument from '../Interfaces/ExchangeYearDocument';
import ExchangeDay from './ExchangeDay';

const ApiClient = Axios.create({
    baseURL: 'https://www.bnr.ro/files/xml/years/',
});

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
    
    public static async fromDate(date: Date) {
        const year = date.getFullYear();
        const response = await ApiClient.get(`nbrfxrates${year}.xml`);
        const contentType = response.headers['content-type'];
        
        if (!contentType.includes('text/xml')) {
            throw new InvalidBNRResponse(
                `Received an invalid response from bnr.ro wile fetching exchange rates for year: ${year}`,
                {
                    response,
                    date,
                },
            );
        }
        
        const parsedXml = await ParseXML(response.data).catch((cause: Error) => {
            throw new XMLParsingError(`Unable to parse response from BNR!`, {
                response,
                cause,
                date
            });
        });
        
        return new this(parsedXml);
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