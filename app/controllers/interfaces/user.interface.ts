import { DateTime } from 'luxon'

export interface UserInterface<T> {
  id: number
  fullName: string | null
  email: string
  password?: string // Le mot de passe n'est pas toujours nécessaire pour les opérations de l'utilisateur, donc il peut être optionnel ou omis dans certains cas.
  providerId: string
  provider: string
  createdAt: DateTime
  updatedAt: DateTime | null
}
