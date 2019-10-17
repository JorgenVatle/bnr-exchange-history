import Axios from 'axios';
import { parseStringPromise as ParseXML } from 'xml2js';
import ExchangeYear from './Models/ExchangeYear';

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
     * Fetch rates for the given date.
     */
    public getRates(date = new Date()) {
        // Todo: fetch rates
    }

}