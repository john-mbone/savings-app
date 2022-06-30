const fs = require('fs')
const excelJS = require("exceljs")

const createXLXS = async (transactions, res) => {
    const workbook = new excelJS.Workbook();  // Create a new workbook

    const worksheet = workbook.addWorksheet(`Transactions`); // New Worksheet

    worksheet.columns = [
        { header: "Transaction ID.", key: "id", width: 10 },
        { header: "Savings Amount", key: "amount", width: 10 },
        { header: "Narration", key: "narration", width: 20 },
        { header: "Transaction Time", key: "createdAt", width: 20 }
    ]

    for (const row of transactions) {
        worksheet.addRow(row)
    }

    // Make row 0 bold
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, size: 14 };
    });

    try {
        const path = "./downloads";
        const file_name = `${path}/transactions.xlsx`
        await workbook.xlsx.writeFile(file_name)
        res.json({
            status: true,
            message: "File exported successfully.",
            file_location: file_name,
        });
    } catch (error) {
        res.json({
            status: false,
            message: error.message,
        });
    }
}


module.exports = {createXLXS}