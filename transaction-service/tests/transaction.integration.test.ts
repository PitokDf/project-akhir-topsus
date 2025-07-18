import request from "supertest";
import { db } from "../src/config/prisma";
import server from "../src/app";
import { User } from "@prisma/client";

describe("Transaction Routes", () => {
    let testUser: User;
    let testMenu: any;
    let testCategory: any;

    beforeAll(async () => {
        // Buat data yang dibutuhkan sekali saja
        testUser = await db.user.create({
            data: {
                id: "clerk-test-user-12345",
                name: "Test User",
                email: "test.user@example.com",
                role: "CASHIER",
                password: "password123"
            },
        });

        testCategory = await db.category.create({
            data: {
                name: "Test Category",
            },
        });

        testMenu = await db.menu.create({
            data: {
                name: "Test Menu",
                price: 15000,
                categoryId: testCategory.id,
                description: "A delicious test menu item",
                isActive: true,
            },
        });
    });

    beforeEach(async () => {
        // Hapus data transaksi sebelum setiap tes
        await db.transactionItem.deleteMany();
        await db.transaction.deleteMany();
    });

    afterAll(async () => {
        // Hapus semua data setelah semua tes selesai
        await db.transactionItem.deleteMany();
        await db.transaction.deleteMany();
        await db.menu.deleteMany();
        await db.category.deleteMany();
        await db.user.deleteMany();
        await db.$disconnect();
    });

    describe("POST /api/v1/transactions", () => {
        it("should create a new transaction successfully", async () => {
            const transactionData = {
                paymentMethod: "cash",
                items: [{ menuId: testMenu.id, quantity: 2 }],
                userId: testUser.id,
            };

            const res = await request(server)
                .post("/api/v1/transactions")
                .send(transactionData)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data.userId).toBe(testUser.id);
            expect(res.body.data.totalAmount).toBe(30000);
            expect(res.body.data.items.length).toBe(1);
        });

        it("should fail if menu item does not exist", async () => {
            const transactionData = {
                paymentMethod: "cash",
                items: [{ menuId: 9999, quantity: 1 }], // ID menu tidak ada
                userId: testUser.id,
            };

            const res = await request(server)
                .post("/api/v1/transactions")
                .send(transactionData)
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/One or more menu items not found/i);
        });
    });

    describe("GET /api/v1/transactions", () => {
        beforeEach(async () => {
            // Buat beberapa transaksi untuk di-query
            await db.transaction.create({
                data: {
                    userId: testUser.id,
                    totalAmount: 20000,
                    paymentMethod: 'qris',
                    status: 'completed',
                    items: {
                        create: {
                            menuId: testMenu.id,
                            quantity: 1,
                            priceAtSale: 20000,
                            itemTotal: 20000
                        }
                    }
                }
            })
        });

        it("should return a list of transactions", async () => {
            const res = await request(server)
                .get("/api/v1/transactions")
                .expect(200);

            expect(res.body.data.data).toBeInstanceOf(Array);
            expect(res.body.data.data.length).toBeGreaterThan(0);
            expect(res.body.data.meta.total).toBe(1);
        });

        it("should filter transactions by status", async () => {
            const res = await request(server)
                .get("/api/v1/transactions?status=completed")
                .expect(200);

            expect(res.body.data.data.length).toBe(1);
            expect(res.body.data.data[0].status).toBe('completed');
        });

        it("should return empty list for non-matching filter", async () => {
            const res = await request(server)
                .get("/api/v1/transactions?status=failed")
                .expect(200);

            expect(res.body.data.data.length).toBe(0);
        });
    });

});