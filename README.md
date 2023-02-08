# Historical BNR.ro Exchange Rates for Node.js
Easily grab exchange rates from [bnr.ro](https://bnr.ro). (Supports history lookups for years 2005 - present).

While this package is very similar to [node-bnr](https://github.com/Bloggify/node-bnr) and similar exchange rate
packages with support for [bnr.ro](https://bnr.ro/), all of these lack support for fetching exchange rates on days
other than 'today'. This package aims to resolve that, allowing lookups for any date between January 3rd, 2005 and
'today'. 

[![Downloads](https://img.shields.io/npm/dt/bnr-exchange-history.svg)](https://www.npmjs.com/package/bnr-exchange-history)
[![Version](https://img.shields.io/npm/v/bnr-exchange-history.svg)](https://www.npmjs.com/package/bnr-exchange-history)
[![Node Version](https://img.shields.io/node/v/bnr-exchange-history.svg)](https://www.npmjs.com/package/bnr-exchange-history)
[![Test](https://github.com/JorgenVatle/bnr-exchange-history/actions/workflows/test.yml/badge.svg)](https://github.com/JorgenVatle/bnr-exchange-history/actions/workflows/test.yml)

## Installation
```bash
npm install bnr-exchange-history
```

## Importing
```typescript
// ES Modules
import BNR from 'bnr-exchange-history';

// ... or CommonJS
const BNR = require('bnr-exchange-history').default;
```

## Usage
```typescript
// Exchange rates for today.
BNR.getRates().then((rates) => {
    console.log(rates) // { 
    // EUR: { rate: 4.7537, multiplier: 1 },
    // USD: { rate: 4.3082, multiplier: 1, },
    // ...
    //}
});

// Exchange rates for January 1st, 2019
BNR.getRates({ date: new Date('Jan 1, 2019') }).then((rates) => {
    console.log(rates) // { 
    // EUR: { rate: 4.6639, multiplier: 1 },
    // USD: { rate: 4.0736, multiplier: 1, },
    // ...
    //}
});

// Fetch exchange rates for an invoicing date. 
// Especially useful for invoices that should include exchange rates for 
// the previous banking day when issuing invoices in currencies other than RON.
BNR.getRates({ date: new Date('Oct 18, 2019'), invoice: true }).then((rates) => {
    console.log(rates) // { -> Returns exchange rates for Oct 17 instead of Oct 18.
    // EUR: { rate: 4.7550, multiplier: 1 },
    // USD: { rate: 4.2719, multiplier: 1, },
    // ...
    //}
});
```

## Notes
As BNR does not post exchange rates for non-banking days, requests for a non-banking day will automatically fall back to
the most recent previous banking day for exchange rates.

This happens on dates like January 1 and 2 of 2019. So a request for Jan 2, 2019 will output exchange rates for
Dec 31, 2018 which is the most recent past update for the requested date.

### Multiplier
The `multiplier` attribute indicates currencies with and without support for decimals. For example JPY, with a
multiplier of 100, should be rounded off to the closest whole number.

E.g. If the exchange rate for JPY is 3.7008, a conversion from 150 RON to JPY would be `(150 / 3.7008) * 100`. As the
currency does not support decimals, you'll probably want to round it off. `Math.round((150 / 3.7008) * 100)`

### Alternatives
If all you need is to fetch exchange rates for the _current day_, you'll probably be better off with Bloggify's
[node-bnr](https://github.com/Bloggify/node-bnr) package.

## License
This repository is licensed under the ISC license.

Copyright (c) 2019, Jørgen Vatle.
