import { HttpStatus } from "../constants/http-status";
import { Messages } from "../constants/message";
import { AppError } from "../errors/app-error";
import { UserRepository } from "../repositories/user.repository";
import { LoginUserInput, RegisterUserInput } from "../schemas/auth.schema";
import { BcryptUtil, JwtUtil } from "../utils";

export async function registerService(data: RegisterUserInput) {
    const hashedPassword = (await BcryptUtil.hash(data.password))!

    const user = await UserRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'CASHIER',
    })

    const { password, ...safeUser } = user;
    return safeUser
}

export async function loginService(data: LoginUserInput) {
    const user = await UserRepository.findByEmail(data.email)

    if (!user) throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const isMatch = await BcryptUtil.compare(data.password!, user.password);

    if (!isMatch) throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt
    };
    const token = JwtUtil.generate(payload);

    return { token, user: payload }
}