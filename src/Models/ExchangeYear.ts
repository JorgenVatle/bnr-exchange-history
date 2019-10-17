import ExchangeYearDocument from '../Interfaces/ExchangeYearDocument';

export default class ExchangeYear {

    /**
     * Exchange document.
     */
    protected readonly data: ExchangeYearDocument;

    /**
    /**
     * Exchange Year document.
     */
    public constructor(data: ExchangeYearDocument) {
        this.data = data;
    }

}