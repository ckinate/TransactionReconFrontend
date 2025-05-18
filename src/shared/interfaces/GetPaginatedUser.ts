
export interface GetPaginatedUser {
  items: Item[]
  pageIndex: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface Item {
  id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  lastLoginAt: string
  userPermissions: any
  refreshTokens: any
}