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