import BNRExchangeHistory from './BNRExchangeHistory';

describe('BNRExchangeHistory', () => {
    
    it('can fetch exchange rates for today', async () => {
        const rates = await BNRExchangeHistory.getRates({ date: new Date() });
        
        expect(rates.USD.rate).toBeGreaterThan(0);
        expect(rates.USD.multiplier).toBeGreaterThan(0);
        expect(rates.USD.name).toBe('USD');
    });
    
    it('can fetch exchange rates for a specific date', async () => {
        const Feb5_2023 = 1675620351166;
        const expectedRate = 4.4632;
        
        const rates = await BNRExchangeHistory.getRates({ date: new Date(Feb5_2023) });
        
        expect(rates.USD.rate).toBe(expectedRate);
    })
    
})