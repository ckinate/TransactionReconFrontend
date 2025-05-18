export interface GetUserDto {
    id: string
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    lastLoginAt: string
    roles: string[]
    permissions: any[]
  }