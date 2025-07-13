import { Router } from 'express';
import { getSalesReport, downloadSalesReport } from '../controller/report.controller';

const router = Router();

router.get('/sales', getSalesReport);
router.get('/sales/download', downloadSalesReport);

export default router;