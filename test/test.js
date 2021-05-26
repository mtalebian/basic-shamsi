import { Shamsi, Miladi } from '../src/index.js'


console.log("");
console.log("=> Convertion");
console.log("     Miladi.toShamsi('2021-05-26T13:57:31.2311892-04:00'): ", Miladi.toShamsi('2021-05-26T13:57:31.2311892-04:00'));
console.log("     Miladi.toShamsi('2021/05/15 11:20'): ", Miladi.toShamsi('2021/05/15 11:20'));
console.log("     Miladi.toShamsi('2021/05/15')      : ", Miladi.toShamsi('2021/05/15'));
console.log("     Miladi.toShamsi(new Date())        : ", Miladi.toShamsi(new Date()));
console.log("     Shamsi.toMiladi('1400/01/01')      : ", Shamsi.toMiladi('1400/01/01'));
console.log("     Shamsi.toMiladi(new Date())        : ", Shamsi.toMiladi(new Date()));


console.log("");
console.log("");
console.log("=> Parse (convert string to Date object)");
console.log("     Miladi.parse('2021/05/15') : ", Miladi.parse('2021/05/15').toString());
console.log("     Shamsi.parse('1400/01/01') : ", Shamsi.parse('1400/01/01').toString());
console.log("");
console.log("");
console.log("=> Validation");
console.log("     Miladi.isValid('2021/01/16') : ", Miladi.isValid('2021/01/16'));
console.log("     Miladi.isValid('2021/1/16') : ", Miladi.isValid('2021/1/16'));
console.log("     Miladi.isValid('2021/1/31') : ", Miladi.isValid('2021/1/31'));
console.log("     Miladi.isValid('2021/11') : ", Miladi.isValid('2021/11'));
console.log("");
console.log("     Shamsi.isValid('1400/01/01') : ", Shamsi.isValid('1400/01/01'));
console.log("     Shamsi.isValid('1400/1/1') : ", Shamsi.isValid('1400/1/1'));
console.log("     Shamsi.isValid('1400/12/31') : ", Shamsi.isValid('1400/12/31'));
console.log("     Shamsi.isValid('1400//01') : ", Shamsi.isValid('1400//01'));


console.log("");
console.log("");
console.log("=> Manipulation");
console.log("     Shamsi.addDays('1400/1/1', 90)         : ", Shamsi.addDays('1400/1/1', 90));
console.log("     Shamsi.addDays('1400/1/1', -1)         : ", Shamsi.addDays('1400/1/1', -1));
console.log("     Shamsi.addMonths('1400/1/1', 3)        : ", Shamsi.addMonths('1400/1/1', 3));
console.log("     Shamsi.addMonths('1400/1/1', -3)       : ", Shamsi.addMonths('1400/1/1', -3));
console.log("     Shamsi.subtract('1401/1/1', '1400/1/1'): ", Shamsi.subtract('1401/1/1', '1400/1/1'));
console.log("  *  Shamsi.subtract(new Date(), '1400/1/1'): ", Shamsi.subtract(new Date(), '1400/1/1') + " days is passed from '1400/1/1'");
console.log("");
console.log("     Miladi.addDays('2021/1/1', 90)         : ", Miladi.addDays('2021/1/1', 90));
console.log("     Miladi.addDays('2021/1/1', -1)         : ", Miladi.addDays('2021/1/1', -1));
console.log("     Miladi.addMonths('2021/1/1', 3)        : ", Miladi.addMonths('2021/1/1', 3));
console.log("     Miladi.addMonths('2021/1/1', -3)       : ", Miladi.addMonths('2021/1/1', -3));
console.log("     Miladi.subtract('2022/1/1', '2021/1/1'): ", Miladi.subtract('2022/1/1', '2021/1/1'));
console.log("  *  Miladi.subtract(new Date(), '2021/1/1'): ", Miladi.subtract(new Date(), '2021/1/1') + " days is passed from '2021/1/1'");


console.log("");
console.log("");
console.log("=> Display");
console.log("   * Shamsi.format('yyyy/MM/dd HH:mm:ss.zzz', new Date()): ", Shamsi.format('yyyy/MM/dd HH:mm:ss.zzz', new Date()));
console.log("     Shamsi.format('yyyy/MM/dd', '1400/1/1')             : ", Shamsi.format('yyyy/MM/dd', '1400/1/1'));
console.log("     Shamsi.format('yy/M/d', '1400/1/1')                 : ", Shamsi.format('yy/M/d', '1400/1/1'));
console.log("     Shamsi.format('yyyy, MMM, dd ddd', '1400/1/1')      : ", Shamsi.format('yyyy, MMM, dd ddd', '1400/1/1'));
console.log("");  
console.log("     Miladi.format('yyyy/MM/dd', '2021/1/1')             : ", Miladi.format('yyyy/MM/dd', '2021/1/1'));
console.log("     Miladi.format('yy/M/d', '2021/1/1')                 : ", Miladi.format('yy/M/d', '2021/1/1'));
console.log("     Miladi.format('yyyy, MMM, dd ddd', '2021/1/1')      : ", Miladi.format('yyyy, MMM, dd ddd', '2021/1/1'));

