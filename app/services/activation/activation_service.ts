import User from '#models/user'
import { tokenUtils } from '../../utils/token_utils.js'
import EmailService from '#services/email/email_service'
import { DateTime } from 'luxon'
import ActivationToken from '#models/activation_token'

export class ActivationService {
  static async sendActivationEmail(user: User, urlBase?: string): Promise<void> {
    const token = tokenUtils.generateToken()
    const expiresAt = DateTime.now().plus({ days: 2 })

    await ActivationToken.create({
      userId: user.id,
      token: token,
      expiresAt: expiresAt,
    })

    await EmailService.sendActivationEmail(user.email, token, user.fullName, urlBase)
  }
  static async activateUser(email: string, token: string): Promise<boolean> {
    const activationToken = await ActivationToken.query()
      .whereHas('user', (query) => {
        query.where('email', email)
      })
      .andWhere('token', token)
      .andWhere('expiresAt', '>', DateTime.now().toSQL())
      .first()

    if (!activationToken) {
      return false
    }

    const user = await User.findOrFail(activationToken.userId)
    user.is_activated = true
    await user.save()

    await activationToken.delete()
    return true
  }
}
