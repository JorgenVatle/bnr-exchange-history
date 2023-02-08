import Moment from 'moment';
import BNRExchangeHistory from './BNRExchangeHistory';

function getDate(date: string) {
    return Moment(date).utcOffset(120);
}

const knownRates = {
    Friday_Feb_3_2023: {
        date: getDate('03 Feb 2023 19:00:00 +0200'),
        USD: 4.4823,
    },
    Sunday_Feb_5_2023: {
        date: getDate('05 Feb 2023 19:00:00 +0200'),
        USD: 4.4823,
    },
    Tuesday_Feb_7_2023: {
        date: getDate('07 Feb 2023 19:00:00 +0200'),
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
            date: date.toDate(),
            invoice: false,
        });
        
        expect(rates.USD.rate).toBe(USD);
    })
    
    it('can fetch exchange rates for non-banking days', async () => {
        const { date, USD } = knownRates.Sunday_Feb_5_2023;
        
        const rates = await BNRExchangeHistory.getRates({
            date: date.toDate(),
            invoice: false,
        });
        
        expect(rates.USD.rate).toBe(USD);
    })
    
})