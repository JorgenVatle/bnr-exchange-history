import Moment from 'moment';
import BNRExchangeHistory from './BNRExchangeHistory';
import { BNRError } from './Errors/BNRError';

function getDate(date: string) {
    return Moment(date).utcOffset(120);
}

function formatDate(inputDate: Moment.Moment | Date) {
    const date = Moment(inputDate);
    
    return date.format('YYYY-MM-DD');
}

const knownRates = {
    Friday_Dec_30_2022: {
        date: getDate('30 Dec 2022 19:00:00 +0200'),
        USD: 4.6346,
    },
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
    
        expect(formatDate(rates.USD.date)).toBe('2023-02-07');
        expect(rates.USD.rate).toBe(USD);
    })
    
    it('can fetch exchange rates for non-banking days', async () => {
        const { date, USD } = knownRates.Sunday_Feb_5_2023;
        const expected = knownRates.Friday_Feb_3_2023;
        
        const rates = await BNRExchangeHistory.getRates({
            date: date.toDate(),
            invoice: false,
        });
        
        expect(formatDate(rates.USD.date)).toBe(formatDate(expected.date));
        expect(rates.USD.rate).toBe(expected.USD);
    });
    
    it('will catch and wrap exceptions during XML parsing', async () => {
        // This appears to cause an XML parsing exception.
        const malformedDate = Moment('Feb 3, 2023 - 19:00').utcOffset(120);
        const request = BNRExchangeHistory.getRates({ date: malformedDate.toDate() });
        
        await expect(request).rejects.toBeInstanceOf(BNRError);
    });
    
    it('will fetch exchange rates from the previous year if necessary', async () => {
        const date = getDate('01 Jan 2023 19:00:00 +0200');
        const expected = knownRates.Friday_Dec_30_2022;
        
        const rates = await BNRExchangeHistory.getRates({ date: date.toDate(), invoice: false });
    
        expect(formatDate(rates.USD.date)).toBe(formatDate(expected.date));
        expect(rates.USD.rate).toBe(expected.USD);
    })
    
})