import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import ExchangeYear from './Models/ExchangeYear';
import Moment from 'moment';

export default new class BNRExchangeHistory {

    /**
     * API Client.
     */
    protected readonly API = Axios.create({
        baseURL: 'https://www.bnr.ro/files/xml/years/',
    });

    /**
     * Get exchange rates for the given year.
     */
    protected getYear(date: Date): Promise<ExchangeYear> {
        return this.API.get(`nbrfxrates${date.getFullYear()}.xml`).then(async (response) => {
            return new ExchangeYear(await ParseXML(response.data));
        })
    }

    /**
     * Create an error.
     */
    protected error(message: string) {
        return new Error(`[bnr-exchange-history] ${message}`);
    }

    /**
     * Fetch rates for the given date.
     */
    public async getRates(date = new Date()) {
        let moment = Moment(date);
        let year = await this.getYear(moment.toDate());

        for (let i = 0; i < 25; i++) {
            Moment().subtract(i, 'days');
            const day = year.getDay(moment.toDate());

            if (!year.sameYear(moment.toDate())) {
                year = await this.getYear(moment.toDate());
            }

            if (day) {
                return day.object;
            }

        }

        throw this.error('Date is out of range. Needs to be between today and Jan 3rd, 2005!');
    }

}