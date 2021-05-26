# Basic-Shamsi
A JavaScript date library for converting, parsing, validating, manipulating, and formatting 
**Shamsi** (Jalaali) and **Miladi** (Gregorian) dates


## INSTALL
Install via npm:

```
> npm install basic-shamsi
```


## USAGE
In ****React**** import *Shamsi* and *Miladi* from **basic-template** package.
```javascript
import {Shamsi, Miladi} from 'basic-shamsi'
```


### - Convertion

Convert ***Mildadi*** to ***Shamsi*** date:
```javascript
Miladi.toShamsi('2021-05-26T13:57:31.2311892-04:00'));  // output: 1400/03/05
Miladi.toShamsi('2021/05/15 11:20'));    // output: 1400/02/25
Miladi.toShamsi('2021/05/15'));          // output: 1400/02/25
Miladi.toShamsi(new Date()));            // sample output: 1400/03/05
```

Convert ***Shamsi*** to ***Miladi*** date:

```javascript
Shamsi.toMiladi('1400/01/01'));   // output: 2021/03/21
Shamsi.toMiladi(new Date()));     // sample output: 2021/05/26

```



### - Parse 
Convert string to *Date* object:

```javascript
Miladi.parse('2021/05/15').toString());  // output: Sat May 15 2021 00:00:00 GMT+0430
Shamsi.parse('1400/01/01').toString());  // output: Sun Mar 21 2021 00:00:00 GMT+0330
```
###  - Validation
```javascript
Miladi.isValid('2021/01/16'));      // output: true
Miladi.isValid('2021/1/16'));       // output: true
Miladi.isValid('2021/1/31'));       // output: false
Miladi.isValid('2021/11'));         // output: false

Shamsi.isValid('1400/01/01'));      // output: true
Shamsi.isValid('1400/1/1'));        // output: true
Shamsi.isValid('1400/12/31'));      // output: false
Shamsi.isValid('1400//01'));        // output: false
```

### - Manipulation
```javascript
Shamsi.addDays('1400/1/1', 90));           // output: 1400/03/29
Shamsi.addDays('1400/1/1', -1));           // output: 1399/12/30
Shamsi.addMonths('1400/1/1', 3));          // output: 1400/04/01
Shamsi.addMonths('1400/1/1', -3));         // output: 1399/10/01
Shamsi.subtract('1401/1/1', '1400/1/1'));  // output: 365
Shamsi.subtract(new Date(), '1400/1/1') + " days is passed from '1400/1/1'");
// sample output: 66 days is passed from '1400/1/1'

Miladi.addDays('2021/1/1', 90));            // output: 2021/04/01
Miladi.addDays('2021/1/1', -1));            // output: 2020/12/31
Miladi.addMonths('2021/1/1', 3));           // output: 2021/04/01
Miladi.addMonths('2021/1/1', -3));          // output: 2020/10/01
Miladi.subtract('2022/1/1', '2021/1/1'));   // output: 365
Miladi.subtract(new Date(), '2021/1/1') + " days is passed from '2021/1/1'");
// sample output: 145 days is passed from '2021/1/1'
```



### - Display
```javascript
Shamsi.format('yyyy/MM/dd HH:mm:ss.zzz', new Date()));  // sample ouput: 1400/03/05 12:09:01.378
Shamsi.format('yyyy/MM/dd', '1400/1/1'));               // ouput: 1400/01/01
Shamsi.format('yy/M/d', '1400/1/1'));                   // ouput: 1400/1/1
Shamsi.format('yyyy, MMM, dd ddd', '1400/1/1'));        // ouput: 1400, فروردین, 01 یکشنبه

Miladi.format('yyyy/MM/dd', '2021/1/1'));               // ouput: 2021/01/01
Miladi.format('yy/M/d', '2021/1/1'));                   // ouput: 2021/1/1
Miladi.format('yyyy, MMM, dd ddd', '2021/1/1'));        // ouput: 2021, Jan, 01 Fri
```

