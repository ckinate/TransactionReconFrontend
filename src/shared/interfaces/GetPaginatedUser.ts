
export interface GetPaginatedUser {
  items: UserItem[]
  pageIndex: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface UserItem {
  id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  lastLoginAt: string
  userPermissions: any
  refreshTokens: any
}