import ExchangeYearDocument from './Interfaces/ExchangeYearDocument';

interface CachedDocument {
    document: ExchangeYearDocument,
    lastUpdated: number;
}

export class ResponseCache {
    
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