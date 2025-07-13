import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import * as ReportService from '../service/report.service';
import { ResponseUtil } from '../utils/response';

export const getSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const report = await ReportService.getSalesReport();
    return ResponseUtil.success(res, report);
});
export const downloadSalesReport = asyncHandler(async (req: Request, res: Response) => {
    const pdfBuffer = await ReportService.generateSalesReportPdf();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.pdf');

    res.send(pdfBuffer);
});