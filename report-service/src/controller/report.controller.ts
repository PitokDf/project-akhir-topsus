import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as ReportService from '../service/report.service';
import { ResponseUtil } from '../utils/response';

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = getDatesFromQuery(req);
    console.log(startDate, endDate);

    const report = await ReportService.getSalesReport({ startDate, endDate });
    return ResponseUtil.success(res, report);
});

export const downloadSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = getDatesFromQuery(req);
    const pdfArrayBuffer = await ReportService.generateSalesReportPdf({ startDate, endDate });

    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=laporan-penjualan.pdf');

    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
});

function getDatesFromQuery(req: Request) {
    const { start, end } = req.query;

    let startDate: Date;
    let endDate: Date;

    if (start && typeof start === 'string' && new Date(start).toString() !== 'Invalid Date') {
        startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
    } else {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (end && typeof end === 'string' && new Date(end).toString() !== 'Invalid Date') {
        endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
    } else {
        const now = new Date();
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { startDate, endDate };
}