import { randomBytes } from 'crypto'

export class tokenUtils {
  static generateToken(byteSize: number = 20): string {
    return randomBytes(byteSize).toString('hex')
  }
}
