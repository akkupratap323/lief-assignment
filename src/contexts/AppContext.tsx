'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  auth0Id: string
  email: string
  name?: string
  role: 'MANAGER' | 'CARE_WORKER'
}

interface Shift {
  id: string
  status: 'CLOCKED_IN' | 'CLOCKED_OUT'
  clockInTime: string
  clockOutTime?: string
  totalHours?: number
  organization: {
    id: string
    name: string
  }
}

interface AppState {
  user: User | null
  currentShift: Shift | null
  loading: boolean
  error: string | null
  location: {
    latitude: number | null
    longitude: number | null
    error: string | null
  }
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_SHIFT'; payload: Shift | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOCATION'; payload: { latitude: number; longitude: number } }
  | { type: 'SET_LOCATION_ERROR'; payload: string }

const initialState: AppState = {
  user: null,
  currentShift: null,
  loading: false,
  error: null,
  location: {
    latitude: null,
    longitude: null,
    error: null,
  },
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_CURRENT_SHIFT':
      return { ...state, currentShift: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_LOCATION':
      return {
        ...state,
        location: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          error: null,
        },
      }
    case 'SET_LOCATION_ERROR':
      return {
        ...state,
        location: { ...state.location, error: action.payload },
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const { data: session, status } = useSession()
  const auth0User = session?.user
  const isLoading = status === 'loading'

  useEffect(() => {
    if (auth0User) {
      const appUser: User = {
        id: auth0User.email || '',
        auth0Id: auth0User.email || '',
        email: auth0User.email || '',
        name: auth0User.name || undefined,
        role: 'CARE_WORKER', // Default role, will be updated from GraphQL
      }
      dispatch({ type: 'SET_USER', payload: appUser })
    } else if (!isLoading) {
      dispatch({ type: 'SET_USER', payload: null })
    }
  }, [auth0User, isLoading])

  useEffect(() => {
    // Auto-detect location for all users (needed for both managers creating locations and workers clocking in)
    if (typeof window !== 'undefined' && navigator.geolocation && auth0User) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch({
            type: 'SET_LOCATION',
            payload: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          })
        },
        (error) => {
          dispatch({ type: 'SET_LOCATION_ERROR', payload: error.message })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      )
    }
  }, [auth0User])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}