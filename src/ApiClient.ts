import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import { InvalidBNRResponse, XMLParsingError } from './Errors/BNRError';
import ExchangeYearDocument from './Interfaces/ExchangeYearDocument';

export default new class ApiClient {
    protected readonly client = Axios.create({
        baseURL: 'https://www.bnr.ro/files/xml/years/',
    });
    
    protected readonly cache = new ResponseCache();
    
    public async getXMLForYear(date: Date): Promise<ExchangeYearDocument> {
        if (this.cache.has(date)) {
            return this.cache.get(date);
        }
        
        return this.cache.set(date, await this.fetchRates(date));
    }
    
    protected async fetchRates(date: Date): Promise<ExchangeYearDocument> {
        const year = date.getFullYear();
        const response = await this.client.get(`nbrfxrates${year}.xml`);
        
        const contentType = response.headers['content-type'];
        
        if (!contentType.includes('text/xml')) {
            throw new InvalidBNRResponse(
                `Received an invalid response from bnr.ro wile fetching exchange rates for year: ${year} `
                + `This likely means there isn\'t any exchange data for the provided year.`,
                {
                    response,
                    date,
                },
            );
        }
        
        return ParseXML(response.data).catch((cause: Error) => {
            throw new XMLParsingError(`Unable to parse response from BNR!`, {
                response,
                cause,
                date
            });
        });
    }
}

interface CachedDocument {
    document: ExchangeYearDocument,
    lastUpdated: number;
}

class ResponseCache {
    
    protected readonly cache = new Map<string, CachedDocument>();
    
    public set(date: Date, rates: ExchangeYearDocument): ExchangeYearDocument {
        this.cache.set(this.cacheKey(date), {
            document: rates,
            lastUpdated: Date.now(),
        });
        return rates;
    }
    
    /**
     * Check if we can use the last cached response to retrieve exchange rates for the provided date.
     * It's important that we check to make sure that we don't cache responses for the current year, as these
     * exchange rates change every day.
     */
    public has(date: Date): boolean {
        const key = this.cacheKey(date);
        
        if (!this.cache.has(key)) {
            return false;
        }
        
        if (date.getFullYear() !== new Date().getFullYear()) {
            return true;
        }
        
        const { lastUpdated } = this.cache.get(key) || {};
        
        if (!lastUpdated) {
            return false;
        }
        
        if (lastUpdated > (Date.now() - 60 * 60 * 1000)) {
            return true;
        }
        
        return true;
    }
    
    public get(date: Date): ExchangeYearDocument {
        const response = this.cache.get(this.cacheKey(date));
        
        if (!response) {
            throw new Error('Unable to find response in cache!');
        }
        
        return response.document;
    }
    
    protected cacheKey(date: Date) {
        return date.getFullYear().toString();
    }
}