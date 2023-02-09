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
        let exchangeYear = await ExchangeYear.for({ year: moment.year() });
        const maxDaysInPast = 25;
    
        for (let daysToSubtract = 0; daysToSubtract < maxDaysInPast; daysToSubtract++) {
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