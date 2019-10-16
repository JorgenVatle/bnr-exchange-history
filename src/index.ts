import Axios from 'axios';

export default new class BNRExchangeHistory {

    /**
     * API Client.
     */
    protected readonly API = Axios.create({
        baseURL: 'https://www.bnr.ro/files/xml/years/',
    });

    /**
     * Date to fetch exchange rates for.
     */
    protected date!: Date;

    /**
     * Store the given date.
     */
    private setDate(date: Date) {
        this.date = date;
    }

    /**
     * Fetch rates for the given date.
     */
    public getRates(date = new Date()) {
        this.setDate(date);
        // Todo: fetch rates
    }

}