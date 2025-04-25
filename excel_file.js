const ExcelJS = require('exceljs');

async function generateExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('סיכומים');

    const borderStyle = {
        top: { style: 'medium' },
        left: { style: 'medium' },
        bottom: { style: 'medium' },
        right: { style: 'medium' }
    };

    const headersMap = {
        farm_name: "שם חווה",
        min_begin_date: "תאריך התחלה",
        max_end_date: "תאריך סיום",
        begin_quantity: "כמות התחלתית",
        total_mortality14: "תמותה (14 ימים)",
        percent14_tmuta: "אחוז תמותה (14 ימים)",
        total_marketed_quantity: "כמות משווקת",
        total_weight: "משקל כולל",
        marketing_weight: "משקל שיווק",
        mesukan_weight: "משקל משוכן",
        nezilut_mazon: "נצילות מזון"
    };

    const headerKeys = Object.keys(headersMap);
    const headerTitles = Object.values(headersMap);

    // כותרת גדולה בשורה 2
    worksheet.mergeCells('B2:' + String.fromCharCode(66 + data.length - 1) + '2');
    const titleCell = worksheet.getCell('B2');
    titleCell.value = 'סיכום מדגרים 2025';
    titleCell.font = { size: 18, bold: true, name: 'Arial' }; // Set font to Arial
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // כותרת "שם חווה" בתא B3
    const farmTitleCell = worksheet.getCell('B3');
    farmTitleCell.value = "שם חווה";
    farmTitleCell.font = { bold: true, name: 'Arial' }; // Set font to Arial
    farmTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    farmTitleCell.border = borderStyle;

    // שמות חוות בשורה 3, בעמודות C, D, E וכו'
    data.forEach((item, farmIndex) => {
        const col = 3 + farmIndex;
        const farmCell = worksheet.getCell(3, col);
        farmCell.value = item.farm_name;
        farmCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: getSoftColor(farmIndex) }
        };
        farmCell.font = { bold: true, size: 13, name: 'Arial' }; // Set font to Arial
        farmCell.alignment = { horizontal: 'center', vertical: 'middle' };
        farmCell.border = borderStyle;
    });

    // שמות המדדים בעמודה B (2) משורה 4
    headerTitles.forEach((header, i) => {
        const cell = worksheet.getCell(4 + i, 2);
        cell.value = header;
        cell.font = { bold: true, name: 'Arial' }; // Set font to Arial
        cell.border = borderStyle;
        worksheet.getRow(4 + i).height = 20;
    });

    // הכנסת ערכים בטבלה משורה 4 והלאה
    data.forEach((item, farmIndex) => {
        const col = 3 + farmIndex;

        headerKeys.forEach((key, rowIndex) => {
            const row = 4 + rowIndex;
            const cell = worksheet.getCell(row, col);
            let value = item[key] !== null ? item[key] : '';

            // Apply formatting for specific fields
            if (key === 'percent14_tmuta') {
                if (item[key] < 2) {
                    cell.font = { color: { argb: 'FF0000FF' }, name: 'Arial' }; // Set font to Arial
                } else {
                    cell.font = { color: { argb: 'FFFF0000' }, name: 'Arial' }; // Set font to Arial
                }
            }

            if (key === 'marketing_weight') {
                value = value ? value.toFixed(3) : ''; // 3 digits for משקל משווק
                cell.font = { color: { argb: 'FF0000FF' }, name: 'Arial' }; // Set font to Arial
            }

            if (key === 'nezilut_mazon') {
                value = value ? value.toFixed(2) : ''; // 2 digits for נצילות מזון
                cell.font = { color: { argb: 'FF0000FF' }, name: 'Arial' }; // Set font to Arial
            }

            // Date formatting for תאריך התחלה and תאריך סיום
            if (key === 'min_begin_date' || key === 'max_end_date') {
                const formattedDate = new Date(item[key]);
                value = formattedDate.toLocaleDateString('en-GB'); // Format as DD-MM-YYYY
            }

            cell.value = value;
            cell.border = borderStyle;
            cell.alignment = { horizontal: 'center' };
        });

        // רקע כחול בהיר לשורות 5 ו-6
        [5, 6].forEach(row => {
            const cell = worksheet.getCell(row, col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'DDEEFF' }
            };
        });
    });

    // עיצוב עמודות — רוחב קבוע
    for (let i = 2; i < 3 + data.length; i++) {
        worksheet.getColumn(i).width = 22;
    }

    // מחיקת שורה 4 (שורות שמתחילות מ-4 מכילות את המדדים)
    worksheet.spliceRows(4, 1); // מוחק את שורת המדדים

    return workbook;
}

function getSoftColor(index) {
    const colors = ['FFE6F7FF', 'FFE6FFF7', 'FFFFF7E6', 'FFFFE6F7', 'FFE6FFE6', 'FFFFF0F5'];
    return colors[index % colors.length];
}

module.exports = generateExcel;
