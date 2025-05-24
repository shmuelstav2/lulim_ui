const fs = require('fs');
const generateExcel = require('./excel_file');

const testData = [
    {
        farm_name: 'חווה א',
        min_begin_date: '2025-03-12',
        max_end_date: '2025-04-18',
        begin_quantity: 12345,
        marketing_weight: 2.456,
        mesukan_weight: 2.789,
        total_daily_mortality: 123,
        percent14_tmuta: 1.5,
        nezilut_mazon: 1.75,
        avvarage_sivuk_age: 38.6,
        total_marketed_quantity: 11500,
        total_weight: 28000,
        total_tarovet: 41000,
        ketzev_gdila_iomi: 68.3
    },
    {
        farm_name: 'חווה ב',
        min_begin_date: '2025-02-05',
        max_end_date: '2025-03-25',
        begin_quantity: 9876,
        marketing_weight: 2.113,
        mesukan_weight: 2.5,
        total_daily_mortality: 200,
        percent14_tmuta: 2.3,
        nezilut_mazon: 1.85,
        avvarage_sivuk_age: 37.2,
        total_marketed_quantity: 9500,
        total_weight: 22300,
        total_tarovet: 35500,
        ketzev_gdila_iomi: 70.1
    }
];

(async () => {
    const workbook = await generateExcel(testData);
    await workbook.xlsx.writeFile('output.xlsx');
    console.log('✅ הקובץ נוצר בהצלחה בשם output.xlsx');
})();
