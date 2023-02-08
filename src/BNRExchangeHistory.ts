import Moment from 'moment';
import { BNRError } from './Errors/BNRError';
import ExchangeYear from './Models/ExchangeYear';

async function getRates(
    {
        date = new Date(),
        invoice = false,
    },
) {
    const moment = Moment(date);
    let exchangeYear = await ExchangeYear.fromDate(moment.toDate());
    const maxDaysInPast = 25;
    
    for (let index = 0; index < maxDaysInPast; index++) {
        moment.subtract(index, 'days');
        const day = exchangeYear.getDay(moment.toDate());
        
        if (invoice && moment.isSame(date, 'day')) {
            continue;
        }
        
        if (day) {
            return day.object;
        }
        
        if (!exchangeYear.sameYear(moment.toDate())) {
            exchangeYear = await ExchangeYear.fromDate(moment.toDate());
        }
    }
    
    throw new BNRError('Date is out of range. Needs to be between today and Jan 3rd, 2005!');
}

export default {
    getRates,
};