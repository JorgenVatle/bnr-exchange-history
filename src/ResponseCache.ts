import ExchangeYearDocument, { Year } from './Interfaces/ExchangeYearDocument';

interface CachedDocument {
    document: ExchangeYearDocument,
    lastUpdated: number;
}

export class ResponseCache {
    
    protected readonly cache = new Map<Year, CachedDocument>();
    
    public set(year: Year, rates: ExchangeYearDocument): ExchangeYearDocument {
        this.cache.set(year, {
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
    public has(year: Year): boolean {
        if (!this.cache.has(year)) {
            return false;
        }
        
        if (year !== new Date().getFullYear()) {
            return true;
        }
        
        const { lastUpdated } = this.cache.get(year) || {};
        
        if (!lastUpdated) {
            return false;
        }
        
        if (lastUpdated > (Date.now() - 60 * 60 * 1000)) {
            return true;
        }
        
        return true;
    }
    
    public get(year: Year): ExchangeYearDocument {
        const response = this.cache.get(year);
        
        if (!response) {
            throw new Error('Unable to find response in cache!');
        }
        
        return response.document;
    }
    
    protected cacheKey(year: Year) {
        return year.toString();
    }
}