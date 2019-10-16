# BNR.ro Exchange Rates
Easily grab exchange rates from [bnr.ro](https://bnr.ro). (Supports history lookups for years 2005 - present).

While this package is very similar to [node-bnr](https://github.com/Bloggify/node-bnr) and similar exchange rate
packages with support for [bnr.ro](https://bnr.ro/), all of these lack support for fetching exchange rates on days
other than 'today'. This package aims to resolve that, allowing lookups for any date between January 3rd, 2005 and
'today'. 

## Installation
```bash
npm install bnr-exchange-history
```

## Usage
```typescript
import BNR from 'bnr-exchange-history';

// Exchange rates for today.
BNR.fetchRates().then((rates) => {
    console.log(rates) // { 
    // EUR: { rate: 4.7537, multiplier: 1 },
    // USD: { rate: 4.3082, multiplier: 1, },
    // ...
    //}
});

// Exchange rates for January 1st, 2019
BNR.fetchRates({ date: new Date('Jan 1, 2019') }).then((rates) => {
    console.log(rates) // { 
    // EUR: { rate: 4.6639, multiplier: 1 },
    // USD: { rate: 4.0736, multiplier: 1, },
    // ...
    //}
});
```