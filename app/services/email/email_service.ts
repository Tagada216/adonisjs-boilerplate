import mail from '@adonisjs/mail/services/main'

export default class EmailService {
  static async sendActivationEmail(
    email: string,
    token: string,
    name: string | null,
    urlBase?: string
  ) {
    const activationUrl = `${urlBase}/activate?token=${token}&email=${encodeURIComponent(email)}`

    await mail.send((message) => {
      message
        .from('info@test.com')
        .to(email)
        .subject('Activate Your Account')
        .htmlView('emails/verify_email', { email, activationUrl, name })
    })
  }

  static async sendResetPasswordEmail(
    email: string,
    resetPasswordUrl: string,
    name: string | null
  ) {
    await mail.send((message) => {
      message
        .from('noreply@example.com')
        .to(email)
        .subject('Réinitialisation de votre mot de passe')
        .htmlView('emails/reset_password', { resetPasswordUrl, name })
    })
  }
}
