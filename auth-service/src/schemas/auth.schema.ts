import z from "zod";

const validRoles = ["CASHIER", "ADMIN"] as const;

export const registerUserSchema = z.object({
    name: z
        .string()
        .nonempty({ message: "Nama tidak boleh kosong" })
        .min(3, { message: "Nama minimal 3 karakter" })
        .max(125, "Nama maksimal 125 karakter"),
    email: z
        .string()
        .nonempty({ message: "Email tidak boleh kosong" })
        .email({ message: "Email tidak valid" })
        .max(255, { message: "Email terlalu panjang, maksimal 255 karakter" })
        .transform(str => str.toLowerCase()),
    password: z
        .string()
        .nonempty({ message: "Password tidak boleh kosong" })
        .min(6, { message: "Password minimal 6 karakter" }),
    role: z
        .enum(validRoles, {
            errorMap: () => ({ message: "Role harus salah satu dari CASHIER atau ADMIN" })
        })
        .optional()
        .default("CASHIER"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z
    .object({
        email: z
            .string()
            .nonempty({ message: "Email tidak boleh kosong" })
            .email({ message: "Email tidak valid" })
            .max(255, { message: "Email terlalu panjang, maksimal 255 karakter" })
            .transform(str => str.toLowerCase()),
        password: z
            .string()
            .min(6, { message: "Password minimal 6 karakter" })
    })

export type LoginUserInput = z.infer<typeof loginUserSchema>;
