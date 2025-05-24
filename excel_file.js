const ExcelJS = require('exceljs');

async function generateExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('סיכומים', {
        pageSetup: {
            orientation: 'portrait',
            paperSize: 9,
            horizontalCentered: true
        },
        properties: {
            rtl: true
        }
    });

// הגדרת כיוון הגיליון מימין לשמאל
    worksheet.views = [{ rightToLeft: true }];


    const borderStyle = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
    };

    const headersMap = {
        farm_name: "שם חווה",
        min_begin_date: "קבלת אפרוחים",
        max_end_date: "סיום שיווק",
        begin_quantity: "כמות עופות",
        marketing_weight: "משקל לעוף משווק",
        mesukan_weight: "משקל לעוף משוכן",
        total_daily_mortality: "אחוז תמותה",
        percent14_tmuta: "תמותה עד 14 יום",
        nezilut_mazon: "נצילות מזון",
        avvarage_sivuk_age: "גיל שווק משוקלל",
        total_marketed_quantity: "עופות משווקים",
        total_weight: "סכ\"ה בשר בטון",
        total_tarovet: "סה\"כ תערובת",
        ketzev_gdila_iomi: "קצב גדילה יומי גרם"
    };

    const headerKeys = Object.keys(headersMap);
    const headerTitles = Object.values(headersMap);

    const defaultFont = { size: 12, name: 'Arial' };

    worksheet.mergeCells('B2:' + String.fromCharCode(66 + data.length - 1) + '2');
    const titleCell = worksheet.getCell('B2');
    titleCell.value = 'סיכום מדגרים 2025';
    titleCell.font = { ...defaultFont, size: 18, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    const farmTitleCell = worksheet.getCell('B3');
    farmTitleCell.value = "שם חווה";
    farmTitleCell.font = { ...defaultFont, bold: true };
    farmTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    farmTitleCell.border = borderStyle;

    data.forEach((item, farmIndex) => {
        const col = 3 + farmIndex;
        const farmCell = worksheet.getCell(3, col);
        farmCell.value = item.farm_name;
        farmCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: getSoftColor(farmIndex) }
        };
        farmCell.font = { ...defaultFont, bold: true };
        farmCell.alignment = { horizontal: 'center', vertical: 'middle' };
        farmCell.border = borderStyle;
    });

    headerTitles.forEach((header, i) => {
        const cell = worksheet.getCell(4 + i, 2);
        cell.value = header;
        cell.font = { ...defaultFont, bold: true };
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(4 + i).height = 20;
    });

    data.forEach((item, farmIndex) => {
        const col = 3 + farmIndex;

        headerKeys.forEach((key, rowIndex) => {
            const row = 4 + rowIndex;
            const cell = worksheet.getCell(row, col);
            const rowTitleCell = worksheet.getCell(row, 2);

            let value = item[key] !== null ? item[key] : '';

            if (key === 'total_daily_mortality') {
                const mortality = item[key] || 0;
                const beginQuantity = item.begin_quantity || 1;
                value = ((mortality / beginQuantity) * 100).toFixed(2);
                cell.font = rowTitleCell.font = { ...defaultFont, color: { argb: 'FFFF0000' } };
            } else if (key === 'percent14_tmuta') {
                cell.font = rowTitleCell.font = {
                    ...defaultFont,
                    color: { argb: 'FFFF0000' }
                };
            } else if (key === 'marketing_weight' || key === 'nezilut_mazon' || key === 'mesukan_weight') {
                if (typeof value === 'number') {
                    value = value.toFixed(key === 'marketing_weight' ? 3 : 2);
                }
                cell.font = rowTitleCell.font = { ...defaultFont, color: { argb: 'FF0000FF' } };
                cell.fill = rowTitleCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E6F5E6' }
                };
            } else if (key === 'min_begin_date' || key === 'max_end_date') {
                const d = new Date(item[key]);
                value = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            } else if (
                ['begin_quantity', 'total_marketed_quantity', 'total_weight', 'total_tarovet'].includes(key)
                && typeof value === 'number'
            ) {
                value = value.toLocaleString('en-US'); // פסיקים כל 3 ספרות
            } else if (typeof value === 'number') {
                value = value.toFixed(2);
            }

            cell.value = value;
            cell.border = borderStyle;
            cell.alignment = { horizontal: 'center' };
            cell.font = { ...defaultFont, ...cell.font };

            rowTitleCell.border = borderStyle;
        });

        // רקע טורקיז בהיר לשורות 5 ו-6 לפני מחיקת שורה 4
        [5, 6].forEach(row => {
            const dataCell = worksheet.getCell(row, col);
            const labelCell = worksheet.getCell(row, 2);
            dataCell.fill = labelCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'DDF7F7' }
            };
        });
    });

    for (let i = 2; i < 3 + data.length; i++) {
        if (i !== 2) {
            worksheet.getColumn(i).width = 18 * 0.9;
        } else {
            worksheet.getColumn(i).width = 18; // עמודה 2 (B) נשארת כמו שהיא
        }
    }

    worksheet.spliceRows(4, 1); // מוחק את שורה 4 (המדדים)

    return workbook;
}

function getSoftColor(index) {
    const colors = [
        'FF99CCFF', // כחול תכלכל
        'FF66FFCC', // ירקרק פסטלי
        'FFFFCC99', // כתום בהיר
        'FFFF9999', // אדום ורדרד
        'FFCCCCFF', // סגול בהיר
        'FF99FF99', // ירוק פסטלי
        'FFFFFF99', // צהוב בהיר
        'FFFFB3E6', // ורוד פסטלי
        'FFB3E6FF', // תכלת
        'FFC0C0C0', // אפור בהיר
        'FFFFD700', // זהב
        'FF87CEEB', // תכלת שמיים
        'FF40E0D0'  // טורקיז
    ];
    return colors[index % colors.length];
}

module.exports = generateExcel;
