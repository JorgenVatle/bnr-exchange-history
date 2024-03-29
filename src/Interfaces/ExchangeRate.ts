/**
 * Currency code string.
 */
export type CurrencyCode = 'RON' | 'AED' | 'AUD' | 'BGN' | 'BRL' | 'CAD' | 'CHF' | 'CNY' | 'CZK' | 'DKK' | 'EGP' | 'EUR' | 'GBP' | 'HRK' | 'HUF' | 'INR' | 'JPY' | 'KRW' | 'MDL' | 'MXN' | 'NOK' | 'NZD' | 'PLN' | 'RSD' | 'RUB' | 'SEK' | 'THB' | 'TRY' | 'UAH' | 'USD' | 'XAU' | 'XDR' | 'ZAR';

/**
 * Exchange rate object.
 */
export interface ExchangeRate<Currency extends CurrencyCode = CurrencyCode> {
    /**
     * Currency multiplier. Used for currencies like Japanese Yen that don't support decimals.
     * E.g. USD = 1, JPY = 100
     */
    multiplier: number;

    /**
     * Exchange rate of the current currency to RON.
     * E.g. USD = 4.1782
     */
    rate: number;

    /**
     * Currency code of the selected currency.
     */
    name: Currency;
    
    
    /**
     * The date this exchange rate pertains to.
     */
    date: Date,
}

/**
 * Exchange rate object.
 */
export type ExchangeRates = {
    [Key in CurrencyCode]: ExchangeRate<Key>;
}