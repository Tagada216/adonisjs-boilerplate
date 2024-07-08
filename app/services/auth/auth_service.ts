// app/Services/AuthService.ts
import env from '#start/env'
import User from '#models/user'
import type { RegisterRequest } from '#controllers/interfaces/register.interface'
import { ActivationService } from '#services/activation/activation_service'

class AuthService {
  async register(payload: RegisterRequest) {
    const user = await User.create(payload)

    await ActivationService.sendActivationEmail(user, env.get('BASE_URL'))
    return user
  }

  async login(email: string, password: string) {
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: env.get('JWT_EXPIRY'),
    })

    return { token, user }
  }
}

export default new AuthService()
