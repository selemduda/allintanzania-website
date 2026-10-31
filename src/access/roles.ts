import type { Access, FieldAccess } from 'payload'

export type Role = 'admin' | 'editor' | 'sales'

type UserWithRoles = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: UserWithRoles, ...roles: Role[]) =>
  Boolean(user?.roles?.some((role) => roles.includes(role)))

export const anyone: Access = () => true

export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

export const admins: Access = ({ req: { user } }) => hasRole(user as UserWithRoles, 'admin')

export const editors: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, 'admin', 'editor')

export const salesTeam: Access = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, 'admin', 'sales')

export const adminFieldOnly: FieldAccess = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, 'admin')

/** Public can read published docs; logged-in staff can read drafts too. */
export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}
