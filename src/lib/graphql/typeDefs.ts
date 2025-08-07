import { gql } from '@apollo/client'

export const typeDefs = gql`
  scalar DateTime

  enum UserRole {
    MANAGER
    CARE_WORKER
  }

  enum ShiftStatus {
    CLOCKED_IN
    CLOCKED_OUT
  }

  type User {
    id: ID!
    auth0Id: String!
    email: String!
    name: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
    shifts: [Shift!]!
  }

  type Organization {
    id: ID!
    name: String!
    address: String
    latitude: Float!
    longitude: Float!
    radiusKm: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    shifts: [Shift!]!
  }

  type Shift {
    id: ID!
    userId: String!
    organizationId: String!
    status: ShiftStatus!
    clockInTime: DateTime!
    clockInLat: Float
    clockInLng: Float
    clockInNote: String
    clockOutTime: DateTime
    clockOutLat: Float
    clockOutLng: Float
    clockOutNote: String
    totalHours: Float
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    organization: Organization!
  }

  input ClockInInput {
    organizationId: String!
    latitude: Float
    longitude: Float
    note: String
  }

  input ClockOutInput {
    shiftId: String!
    latitude: Float
    longitude: Float
    note: String
  }

  input CreateOrganizationInput {
    name: String!
    address: String
    latitude: Float!
    longitude: Float!
    radiusKm: Float
  }

  input UpdateOrganizationInput {
    name: String!
    address: String
    latitude: Float!
    longitude: Float!
    radiusKm: Float
  }

  type DashboardStats {
    avgHoursPerDay: Float!
    dailyClockIns: Int!
    weeklyHoursByStaff: [WeeklyHours!]!
  }

  type WeeklyHours {
    userId: String!
    userName: String!
    totalHours: Float!
  }

  type Query {
    me: User
    currentShift: Shift
    myShifts: [Shift!]!
    allActiveShifts: [Shift!]!
    allShifts: [Shift!]!
    organization(id: String!): Organization
    organizations: [Organization!]!
    dashboardStats: DashboardStats!
    isWithinPerimeter(organizationId: String!, latitude: Float!, longitude: Float!): Boolean!
  }

  type Mutation {
    clockIn(input: ClockInInput!): Shift!
    clockOut(input: ClockOutInput!): Shift!
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: String!, input: UpdateOrganizationInput!): Organization!
    deleteOrganization(id: String!): Organization!
    updateUserRole(userId: String!, role: UserRole!): User!
  }
`