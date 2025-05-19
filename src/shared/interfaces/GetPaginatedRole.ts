export interface GetPaginatedRole {
  items: RoleItem[]
  pageIndex: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface RoleItem {
  id: string
  name: string
  description: string
  rolePermissions: any
}