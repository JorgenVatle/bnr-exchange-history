import Axios from 'axios/index';
import { parseStringPromise as ParseXML } from 'xml2js';
import { InvalidBNRResponse, XMLParsingError } from './Errors/BNRError';

export default new class ApiClient {
    protected readonly client = Axios.create({
        baseURL: 'https://www.bnr.ro/files/xml/years/',
    });
    
    public async getXMLForYear(date: Date) {
        const year = date.getFullYear();
        const response = await this.client.get(`nbrfxrates${year}.xml`);
    
        const contentType = response.headers['content-type'];
    
        if (!contentType.includes('text/xml')) {
            throw new InvalidBNRResponse(
                `Received an invalid response from bnr.ro wile fetching exchange rates for year: ${year} `
                + `This likely means there isn\'t any exchange data for the provided year.`,
                {
                    response,
                    date,
                },
            );
        }
    
        return ParseXML(response.data).catch((cause: Error) => {
            throw new XMLParsingError(`Unable to parse response from BNR!`, {
                response,
                cause,
                date
            });
        });
    }
}