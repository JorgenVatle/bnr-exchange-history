import Axios from 'axios';
import Moment from 'moment';
import { parseStringPromise as ParseXML } from 'xml2js';
import { BNRError } from './Errors/BNRError';
import ExchangeYear from './Models/ExchangeYear';

const API = Axios.create({
    baseURL: 'https://www.bnr.ro/files/xml/years/',
});

function getYear(date: Date): Promise<ExchangeYear> {
    return API.get(`nbrfxrates${date.getFullYear()}.xml`).then(async (response) => {
        return new ExchangeYear(await ParseXML(response.data));
    });
}

async function getRates(
    {
        date = new Date(),
        invoice = false,
    },
) {
    const moment = Moment(date);
    let year = await getYear(moment.toDate());
    const maxDaysInPast = 25;
    
    for (let index = 0; index < maxDaysInPast; index++) {
        moment.subtract(index, 'days');
        const day = year.getDay(moment.toDate());
        
        if (invoice && moment.isSame(date, 'day')) {
            continue;
        }
        
        if (day) {
            return day.object;
        }
        
        if (!year.sameYear(moment.toDate())) {
            year = await getYear(moment.toDate());
        }
    }
    
    throw new BNRError('Date is out of range. Needs to be between today and Jan 3rd, 2005!');
}

export default {
    getRates,
};