import BNRExchangeHistory from './BNRExchangeHistory';

const knownRates = {
    Friday_Feb_3_2023: {
        date: new Date(1675448485315),
        USD: 4.4823,
    },
    Sunday_Feb_5_2023: {
        date: new Date(1675620351166),
        USD: 4.4823,
    },
    Tuesday_Feb_7_2023: {
        date: new Date(1675794357453),
        USD: 4.5747,
    }
}

describe('BNRExchangeHistory', () => {
    
    it('can fetch exchange rates for today', async () => {
        const rates = await BNRExchangeHistory.getRates({ date: new Date() });
        
        expect(rates.USD.rate).toBeGreaterThan(0);
        expect(rates.USD.multiplier).toBeGreaterThan(0);
        expect(rates.USD.name).toBe('USD');
    });
    
    it('can fetch exchange rates for a specific date', async () => {
        const { date, USD } = knownRates.Tuesday_Feb_7_2023;
        
        const rates = await BNRExchangeHistory.getRates({
            date,
            invoice: false,
        });
        
        expect(rates.USD.rate).toBe(USD);
    })
    
    it('can fetch exchange rates for non-banking days', async () => {
        const { date, USD } = knownRates.Sunday_Feb_5_2023;
        
        const rates = await BNRExchangeHistory.getRates({ date });
        
        expect(rates.USD.rate).toBe(USD);
    })
    
})