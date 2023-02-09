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
        const maxDaysToTraverse = 25;
    
        for (let daysToSubtract = 0; daysToSubtract < maxDaysToTraverse; daysToSubtract++) {
            const moment = Moment(date).subtract(daysToSubtract, 'days');
            const exchangeYear = await this.getExchangeYear(moment);
            const exchangeDay = exchangeYear.getDay(moment.toDate());
        
            if (invoice && moment.isSame(date, 'day')) {
                continue;
            }
        
            if (exchangeDay) {
                return exchangeDay.getRates();
            }
        }
    
        throw new BNRError('Date is out of range. Needs to be between today and Jan 3rd, 2005!');
    }
    
    protected validateDate(date: Moment.Moment) {
        if (date.isAfter(Date.now(), 'day')) {
            throw new BNRError(`The provided date "${date.calendar()}" appears to be in the future!`);
        }
    }
    
    protected getExchangeYear(date: Moment.Moment) {
        this.validateDate(date);
        
        return ExchangeYear.for({ year: date.year() }).catch((error) => {
            if (!(error instanceof InvalidBNRResponse)) {
                throw error;
            }
        
            if (!date.isSame(Date.now(), 'year')) {
                throw error;
            }
            
            if (date.get('dayOfYear') > 5) {
                throw error;
            }
        
            const lastYear = date.year() - 1;
        
            return ExchangeYear.for({ year: lastYear });
        });
    }
    
}

export default new BNRExchangeHistory();