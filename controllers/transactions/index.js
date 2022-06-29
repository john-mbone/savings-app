const { transaction } = require('../../models')
const moment = require('moment')
const { Op } = require('sequelize')
const fs = require('fs')
const excelJS = require("exceljs")
const { fDateTimeSuffix } = require('../../utils/formatTime')


// http://localhost:9000/transactions?page=1&page_size=2

exports.transactionsHistory = async function (req, res) {

    const savings_id = req.savings_id
    let count = await transaction.count({
        where: {
            savings_id
        }
    })
    let { page_size, page } = req.query
    let limit = parseInt(page_size)
    page = parseInt(req.query.page) - 1

    let pages = (count / limit)

    let offset = (page) * limit

    let result = await transaction.findAll({
        offset, limit,
        order: [['id', 'DESC']],
        where: {
            savings_id
        }
    })

    await createXLXS(result, res)
    // res.json({ status: true, pages: Math.ceil(pages), count, result })
}

// Get data in two ranges and send an excel/pdf
// http://localhost:9000/transactions?page=1&page_size=2&from=2022-06-22&to=2022-06-29
exports.transactionsHistoryWithRange = async function (req, res) {

    let { page_size, page, from, to } = req.query
    let limit = parseInt(page_size)
    const savings_id = req.savings_id
    from = moment(from).add(-1).format('YYYY-MM-DD')
    to = moment(to).add(1).format('YYYY-MM-DD')

    // filter transactions by date
    let count = await transaction.count(
        {
            where: {
                createdAt: {
                    [Op.between]: [from, to]
                },
                savings_id
            }
        }
    )

    let pages = (count / limit)

    let offset = (page) * limit


    let result = await transaction.findAll({
        offset, limit,
        order: [['id', 'DESC']],
        where: {
            createdAt: {
                [Op.between]: [from, to]
            },
            savings_id
        }
    })

    await createXLXS(result, res)
    // res.json({ status: true, pages: Math.ceil(pages), count, result })
}




const createXLXS = async (transactions) => {
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