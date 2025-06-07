export interface GetUserDto {
    id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    isActive: boolean
    lastLoginAt: string
    role: string
    permissions: any[]
  }