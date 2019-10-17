import ExchangeYearDocument from '../Interfaces/ExchangeYearDocument';
import ExchangeDay from './ExchangeDay';

export default class ExchangeYear {

    /**
     * Exchange document.
     */
    protected readonly data: ExchangeYearDocument;

    /**
     * Exchange Year document.
     */
    public constructor(data: ExchangeYearDocument) {
        this.data = data;
    }

    /**
     * Exchange days for the current exchange document.
     */
    public get days() {
        return this.data.DataSet.Body[0].Cube.map((cube) => new ExchangeDay(cube));
    }


}