import { gql } from '@apollo/client'

export const CLOCK_IN = gql`
  mutation ClockIn($input: ClockInInput!) {
    clockIn(input: $input) {
      id
      status
      clockInTime
      clockInNote
      clockInLat
      clockInLng
      organization {
        id
        name
        address
      }
    }
  }
`

export const CLOCK_OUT = gql`
  mutation ClockOut($input: ClockOutInput!) {
    clockOut(input: $input) {
      id
      status
      clockInTime
      clockOutTime
      totalHours
      clockOutNote
      clockOutLat
      clockOutLng
      organization {
        id
        name
        address
      }
    }
  }
`

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      address
      latitude
      longitude
      radiusKm
    }
  }
`

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: String!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      name
      email
      role
    }
  }
`

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      address
      latitude
      longitude
      radiusKm
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: String!) {
    deleteOrganization(id: $id) {
      id
      name
    }
  }
`

export const PROMOTE_TO_MANAGER = gql`
  mutation PromoteToManager {
    promoteToManager {
      id
      name
      email
      role
    }
  }
`