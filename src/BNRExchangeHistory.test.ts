import Moment from 'moment';
import ApiClient from './ApiClient';
import BNRExchangeHistory from './BNRExchangeHistory';
import { BNRError } from './Errors/BNRError';
import ExchangeYear from './Models/ExchangeYear';

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
        USD: null, // No rates on a Sunday :)
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
        const malformedDate = getDate('NaN');
        const request = BNRExchangeHistory.getRates({ date: malformedDate.toDate() });
        
        await expect(request).rejects.toBeInstanceOf(BNRError);
    });
    
    it('will fetch exchange rates from the previous year if necessary', async () => {
        const date = getDate('01 Jan 2023 19:00:00 +0200');
        const expected = knownRates.Friday_Dec_30_2022;
        
        const rates = await BNRExchangeHistory.getRates({ date: date.toDate(), invoice: false });
    
        expect(formatDate(rates.USD.date)).toBe(formatDate(expected.date));
        expect(rates.USD.rate).toBe(expected.USD);
    });
    
    describe('when no exchange history available for the provided year', () => {
        
        describe('if the date is in the future', () => {
            
            it('throws an exception', async () => {
                const nextYear = new Date().getFullYear() + 1;
                const date = getDate(`01 Jan ${nextYear} 19:00:00 +0200`);
    
                const request = BNRExchangeHistory.getRates({
                    date: date.toDate(),
                    invoice: false,
                });
                
                await expect(request).rejects.toBeInstanceOf(BNRError);
            })
            
        });
        
        describe('if the date is today', () => {
            
            it('uses data from the previous year', async function () {
                const currentYear = new Date().getFullYear();
                const date = new Date(`Jan 1, ${currentYear}`);
                
                // Simulating a response for an exchange year that doesn't exist yet.
                // This necessary to deal with an edge-case during new-year where there aren't any exchange rates
                // for the current year.
                const exception = await ApiClient.getXMLForYear(currentYear + 1).catch((error) => error);
                jest.spyOn(ExchangeYear, 'for').mockRejectedValueOnce(exception);
    
                const rates = await BNRExchangeHistory.getRates({
                    date,
                    invoice: false,
                });
    
                expect(rates.USD.date.getFullYear()).toBe(currentYear - 1);
            })
            
        })
        
    })
    
})