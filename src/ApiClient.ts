import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import { InvalidBNRResponse, XMLParsingError } from './Errors/BNRError';
import ExchangeYearDocument, { Year } from './Interfaces/ExchangeYearDocument';
import { ResponseCache } from './ResponseCache';

class ApiClient {
    protected readonly client = Axios.create({
        baseURL: 'https://www.bnr.ro/files/xml/years/',
    });
    
    protected readonly cache = new ResponseCache();
    
    public async getXMLForYear(year: Year): Promise<ExchangeYearDocument> {
        if (this.cache.has(year)) {
            return this.cache.get(year);
        }
        
        return this.cache.set(year, await this.fetchRates(year));
    }
    
    protected async fetchRates(year: Year): Promise<ExchangeYearDocument> {
        const response = await this.client.get(`nbrfxrates${year}.xml`);
        
        const contentType = response.headers['content-type'];
        
        if (!contentType.includes('text/xml')) {
            throw new InvalidBNRResponse(
                `Received an invalid response from bnr.ro wile fetching exchange rates for year: ${year} `
                + `This likely means there isn\'t any exchange data for the provided year.`,
                {
                    response,
                    year,
                },
            );
        }
        
        return ParseXML(response.data).catch((cause: Error) => {
            throw new XMLParsingError(`Unable to parse response from BNR!`, {
                response,
                cause,
                year,
            });
        });
    }
}

export default new ApiClient();