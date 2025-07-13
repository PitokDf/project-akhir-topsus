import * as ReportRepository from '../repositories/report.repository';

export const getSalesReport = async () => {
    return ReportRepository.getSalesReport();
};
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateSalesReportPdf = async () => {
    const { salesReport, summary } = await ReportRepository.getSalesReport();

    const doc = new jsPDF();
    const tableColumn = ["Transaction ID", "User", "Date", "Total Amount"];
    const tableRows: (string | number)[][] = [];

    salesReport.forEach(report => {
        const reportData = [
            report.id,
            report.user.name,
            new Date(report.transactionDate).toLocaleDateString(),
            `Rp ${report.totalAmount.toLocaleString()}`
        ];
        tableRows.push(reportData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.text("Sales Report", 14, 15);
    doc.text(`Total Sales: Rp ${summary.totalSales.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Transactions: ${summary.totalTransactions}`, 14, doc.lastAutoTable.finalY + 20);

    return doc.output('arraybuffer');
};