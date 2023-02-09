import Moment from 'moment';
import { BNRError, InvalidBNRResponse } from './Errors/BNRError';
import ExchangeYear from './Models/ExchangeYear';

class BNRExchangeHistory {
    
    public async getRates(
        {
            date = new Date(),
            invoice = false,
        },
    ) {
        const moment = Moment(date);
        const year = date.getFullYear();
        const maxDaysToTraverse = 25;
        
        if (moment.isAfter(Date.now(), 'day')) {
            throw new BNRError(`The provided date "${moment.calendar()}" appears to be in the future!`);
        }
        
        let exchangeYear = await ExchangeYear.for({ year }).catch((error) => {
            if (!(error instanceof InvalidBNRResponse)) {
                throw error;
            }
            
            if (!moment.isSame(Date.now(), 'year')) {
                throw error;
            }
            
            const lastYear = year - 1;
            
            return ExchangeYear.for({ year: lastYear });
        });
    
        for (let daysToSubtract = 0; daysToSubtract < maxDaysToTraverse; daysToSubtract++) {
            const moment = Moment(date).subtract(daysToSubtract, 'days');
            const exchangeDay = exchangeYear.getDay(moment.toDate());
        
            if (invoice && moment.isSame(date, 'day')) {
                continue;
            }
        
            if (exchangeDay) {
                return exchangeDay.getRates();
            }
        
            if (!exchangeYear.sameYear(moment.toDate())) {
                exchangeYear = await ExchangeYear.for({ year: moment.year() });
            }
        }
    
        throw new BNRError('Date is out of range. Needs to be between today and Jan 3rd, 2005!');
    }
    
}

export default new BNRExchangeHistory();