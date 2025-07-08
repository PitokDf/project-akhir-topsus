import { HttpStatus } from "../constants/http-status";
import { Messages } from "../constants/message";
import { AppError } from "../errors/app-error";
import { UserRepository } from "../repositories/user.repository";
import { LoginUserInput, RegisterUserInput } from "../schemas/auth.schema";
import { BcryptUtil, JwtUtil } from "../utils";

export async function registerService(data: RegisterUserInput) {
    data.password = (await BcryptUtil.hash(data.password))!

    const user = await UserRepository.create(data)

    return user
}

export async function loginService(data: LoginUserInput) {
    const user = await UserRepository.findByEmail(data.email)

    if (!user) throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const isMatch = await BcryptUtil.compare(data.password!, user.password);

    if (!isMatch) throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    const token = JwtUtil.generate(user);

    return token
}