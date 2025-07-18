import * as ReportRepository from '../repositories/report.repository';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const getSalesReport = async (options: ReportRepository.ReportDataOptions) => {
    return ReportRepository.getSalesReport(options);
};

export const generateSalesReportPdf = async (options: ReportRepository.ReportDataOptions) => {
    const { summary, transactions, topSellingProducts, period } = await getSalesReport(options);

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let finalY = 0;

    // Fungsi untuk format mata uang
    const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

    // --- HEADER ---
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text("Laporan Penjualan", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const periodString = `Periode: ${period.start.toLocaleDateString('id-ID')} - ${period.end.toLocaleDateString('id-ID')}`;
    doc.text(periodString, 105, 28, { align: 'center' });
    finalY = 35;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Ringkasan Utama", 14, finalY + 5);
    finalY += 8;

    autoTable(doc, {
        body: [
            ['Total Pendapatan', formatCurrency(summary.totalRevenue)],
            ['Jumlah Transaksi', summary.totalTransactions.toString()],
            ['Total Item Terjual', summary.totalItemsSold.toString()],
            ['Rata-rata per Transaksi', formatCurrency(summary.averagePerTransaction)],
        ],
        startY: finalY,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } },
    });
    finalY = (doc as any).lastAutoTable.finalY;

    if (topSellingProducts.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("10 Produk Terlaris", 14, finalY + 10);
        finalY += 13;

        autoTable(doc, {
            head: [['Peringkat', 'Nama Produk', 'Kategori', 'Jumlah Terjual', 'Pendapatan']],
            body: topSellingProducts.map((p: { rank: any; name: any; category: any; quantitySold: any; totalRevenue: number; }) => [
                p.rank,
                p.name,
                p.category,
                p.quantitySold,
                formatCurrency(p.totalRevenue),
            ]),
            startY: finalY,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 9 },
        });
        finalY = (doc as any).lastAutoTable.finalY;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Rincian Transaksi", 14, finalY + 15);
    finalY += 18;

    autoTable(doc, {
        head: [['ID', 'Tanggal', 'Waktu', 'Kasir', 'Total']],
        body: transactions.map((t: { id: any; transactionDate: string | number | Date; user: { name: any; }; totalAmount: number; }) => [
            t.id,
            new Date(t.transactionDate).toLocaleDateString('id-ID'),
            new Date(t.transactionDate).toLocaleTimeString('id-ID'),
            t.user.name,
            formatCurrency(t.totalAmount),
        ]),
        startY: finalY,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96], textColor: 255 },
        styles: { fontSize: 9, overflow: 'linebreak' },
        didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            const pageCount = doc.internal.pages.length;
            doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, pageHeight - 10);
            doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 210 - data.settings.margin.right, pageHeight - 10, { align: 'right' });
        }
    });

    return doc.output('arraybuffer');
};