import { gql } from '@apollo/client'

export const GET_ME = gql`
  query GetMe {
    me {
      id
      auth0Id
      email
      name
      role
      createdAt
      updatedAt
    }
  }
`

export const GET_CURRENT_SHIFT = gql`
  query GetCurrentShift {
    currentShift {
      id
      status
      clockInTime
      clockInNote
      organization {
        id
        name
        address
      }
    }
  }
`

export const GET_MY_SHIFTS = gql`
  query GetMyShifts {
    myShifts {
      id
      status
      clockInTime
      clockOutTime
      totalHours
      clockInNote
      clockOutNote
      organization {
        id
        name
        address
      }
    }
  }
`

export const GET_ALL_ACTIVE_SHIFTS = gql`
  query GetAllActiveShifts {
    allActiveShifts {
      id
      clockInTime
      clockInLat
      clockInLng
      clockInNote
      user {
        id
        name
        email
      }
      organization {
        id
        name
        address
      }
    }
  }
`

export const GET_ALL_SHIFTS = gql`
  query GetAllShifts {
    allShifts {
      id
      status
      clockInTime
      clockOutTime
      totalHours
      clockInLat
      clockInLng
      clockOutLat
      clockOutLng
      clockInNote
      clockOutNote
      user {
        id
        name
        email
      }
      organization {
        id
        name
        address
      }
    }
  }
`

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      address
      latitude
      longitude
      radiusKm
    }
  }
`

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      avgHoursPerDay
      dailyClockIns
      weeklyHoursByStaff {
        userId
        userName
        totalHours
      }
    }
  }
`

export const IS_WITHIN_PERIMETER = gql`
  query IsWithinPerimeter($organizationId: String!, $latitude: Float!, $longitude: Float!) {
    isWithinPerimeter(organizationId: $organizationId, latitude: $latitude, longitude: $longitude)
  }
`