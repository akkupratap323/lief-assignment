'use client'

import { useSession, signOut } from 'next-auth/react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GET_ME, GET_ALL_ACTIVE_SHIFTS, GET_ALL_SHIFTS, GET_DASHBOARD_STATS, GET_ORGANIZATIONS } from '@/lib/graphql/queries'
import { CREATE_ORGANIZATION, UPDATE_ORGANIZATION, DELETE_ORGANIZATION, UPDATE_USER_ROLE } from '@/lib/graphql/mutations'
import { Clock, Users, BarChart3, ArrowLeft, MapPin, Plus, Settings, Edit, Trash2, X, Navigation } from 'lucide-react'
import Link from 'next/link'
import StatsCharts from '@/components/StatsCharts'
import { useToast } from '@/contexts/ToastContext'

export default function ManagerDashboard() {
  const { data: session, status } = useSession()
  const user = session?.user
  const authLoading = status === 'loading'
  const router = useRouter()
  const { success, error } = useToast()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radiusKm: '5.0'
  })
  const [editingOrg, setEditingOrg] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orgToDelete, setOrgToDelete] = useState<any>(null)
  const [gettingLocation, setGettingLocation] = useState(false)

  const { data: userData, loading: userLoading } = useQuery(GET_ME, { skip: !user })
  const { data: activeShiftsData, loading: activeShiftsLoading } = useQuery(GET_ALL_ACTIVE_SHIFTS, { skip: !user })
  const { data: allShiftsData, loading: allShiftsLoading } = useQuery(GET_ALL_SHIFTS, { skip: !user })
  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS, { skip: !user })
  const { data: organizationsData, refetch: refetchOrganizations } = useQuery(GET_ORGANIZATIONS)

  const [createOrganization] = useMutation(CREATE_ORGANIZATION)
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION)
  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/api/auth/signin')
    }
  }, [authLoading, user, router])

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createOrganization({
        variables: {
          input: {
            name: newOrgForm.name,
            address: newOrgForm.address,
            latitude: parseFloat(newOrgForm.latitude),
            longitude: parseFloat(newOrgForm.longitude),
            radiusKm: parseFloat(newOrgForm.radiusKm)
          }
        }
      })
      setNewOrgForm({ name: '', address: '', latitude: '', longitude: '', radiusKm: '5.0' })
      refetchOrganizations()
      success('Organization created successfully!')
    } catch (error: any) {
      console.error('Error creating organization:', error)
      error(error.message || 'Failed to create organization')
    }
  }

  const handleEditOrganization = (org: any) => {
    setEditingOrg({
      id: org.id,
      name: org.name,
      address: org.address || '',
      latitude: org.latitude.toString(),
      longitude: org.longitude.toString(),
      radiusKm: org.radiusKm.toString()
    })
    setShowEditModal(true)
  }

  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateOrganization({
        variables: {
          id: editingOrg.id,
          input: {
            name: editingOrg.name,
            address: editingOrg.address,
            latitude: parseFloat(editingOrg.latitude),
            longitude: parseFloat(editingOrg.longitude),
            radiusKm: parseFloat(editingOrg.radiusKm)
          }
        }
      })
      setShowEditModal(false)
      setEditingOrg(null)
      refetchOrganizations()
      success('Organization updated successfully!')
    } catch (error: any) {
      console.error('Error updating organization:', error)
      error(error.message || 'Failed to update organization')
    }
  }

  const handleDeleteOrganization = async () => {
    try {
      await deleteOrganization({
        variables: { id: orgToDelete.id }
      })
      setShowDeleteModal(false)
      setOrgToDelete(null)
      refetchOrganizations()
      success('Organization deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting organization:', error)
      error(error.message || 'Failed to delete organization')
    }
  }

  const confirmDelete = (org: any) => {
    setOrgToDelete(org)
    setShowDeleteModal(true)
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    
    if (!navigator.geolocation) {
      error('Geolocation is not supported by this browser.')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewOrgForm({
          ...newOrgForm,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        })
        setGettingLocation(false)
        success('Location detected and filled automatically!')
      },
      (positionError) => {
        let errorMessage = 'An error occurred while getting your location.'
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            errorMessage = 'Location access was denied by user.'
            break
          case positionError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case positionError.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        error(errorMessage)
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  if (authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading Manager Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData?.me || userData.me.role !== 'MANAGER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              This page is only accessible to managers. Please contact your administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {userData.me.name || userData.me.email}
                </span>
                <Badge variant="secondary">
                  Manager
                </Badge>
              </div>
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline mr-2 h-4 w-4" />
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="inline mr-2 h-4 w-4" />
              Staff Management
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'locations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin className="inline mr-2 h-4 w-4" />
              Location Management
            </button>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Currently Clocked In</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {activeShiftsData?.allActiveShifts?.length || 0}
                  </div>
                  <p className="text-sm text-gray-500">Active staff members</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Daily Clock-ins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {statsData?.dashboardStats?.dailyClockIns || 0}
                  </div>
                  <p className="text-sm text-gray-500">Today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Avg Hours/Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {statsData?.dashboardStats?.avgHoursPerDay?.toFixed(1) || '0.0'}
                  </div>
                  <p className="text-sm text-gray-500">Per staff member</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <StatsCharts stats={statsData?.dashboardStats} />

            {/* Currently Active Shifts */}
            <Card>
              <CardHeader>
                <CardTitle>Currently Clocked In Staff</CardTitle>
                <CardDescription>
                  Real-time view of staff members currently on shift
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeShiftsLoading ? (
                  <div className="text-center py-4">Loading active shifts...</div>
                ) : activeShiftsData?.allActiveShifts?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No staff currently clocked in
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Clock In Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeShiftsData?.allActiveShifts?.map((shift: any) => (
                        <TableRow key={shift.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{shift.user.name || shift.user.email}</p>
                              <p className="text-sm text-gray-500">{shift.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{shift.organization.name}</TableCell>
                          <TableCell>
                            {new Date(shift.clockInTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {Math.round((Date.now() - new Date(shift.clockInTime).getTime()) / (1000 * 60))} min
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>All Staff Clock-in/out Records</CardTitle>
                <CardDescription>
                  Detailed view of all staff shifts and work hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allShiftsLoading ? (
                  <div className="text-center py-4">Loading shift records...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff Member</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allShiftsData?.allShifts?.map((shift: any) => (
                        <TableRow key={shift.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{shift.user.name || shift.user.email}</p>
                              <p className="text-sm text-gray-500">{shift.user.role}</p>
                            </div>
                          </TableCell>
                          <TableCell>{shift.organization.name}</TableCell>
                          <TableCell>
                            {new Date(shift.clockInTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {shift.clockOutTime 
                              ? new Date(shift.clockOutTime).toLocaleString() 
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {shift.totalHours 
                              ? `${shift.totalHours.toFixed(2)}h` 
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={shift.status === 'CLOCKED_IN' ? 'default' : 'secondary'}
                            >
                              {shift.status === 'CLOCKED_IN' ? 'Active' : 'Completed'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Location Management Tab */}
        {activeTab === 'locations' && (
          <div className="space-y-8">
            {/* Add New Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Location
                </CardTitle>
                <CardDescription>
                  Set up a new location with geofence perimeter for staff clock-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateOrganization} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={newOrgForm.name}
                      onChange={(e) => setNewOrgForm({...newOrgForm, name: e.target.value})}
                      placeholder="Hospital Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newOrgForm.address}
                      onChange={(e) => setNewOrgForm({...newOrgForm, address: e.target.value})}
                      placeholder="123 Healthcare Ave"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <Label>Location Coordinates</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        disabled={gettingLocation}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {gettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="any"
                          value={newOrgForm.latitude}
                          onChange={(e) => setNewOrgForm({...newOrgForm, latitude: e.target.value})}
                          placeholder="40.7589"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="any"
                          value={newOrgForm.longitude}
                          onChange={(e) => setNewOrgForm({...newOrgForm, longitude: e.target.value})}
                          placeholder="-73.9851"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="radiusKm">Perimeter Radius (km)</Label>
                    <Input
                      id="radiusKm"
                      type="number"
                      step="0.1"
                      value={newOrgForm.radiusKm}
                      onChange={(e) => setNewOrgForm({...newOrgForm, radiusKm: e.target.value})}
                      placeholder="5.0"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full">
                      Create Location
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Existing Organizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manage Existing Locations
                </CardTitle>
                <CardDescription>
                  View and edit location perimeters for clock-in validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Coordinates</TableHead>
                      <TableHead>Perimeter (km)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizationsData?.organizations?.map((org: any) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell>{org.address || '-'}</TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {org.latitude.toFixed(4)}, {org.longitude.toFixed(4)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {org.radiusKm} km
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditOrganization(org)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => confirmDelete(org)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Edit Organization Modal */}
      {showEditModal && editingOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Organization</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleUpdateOrganization} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Organization Name</Label>
                <Input
                  id="edit-name"
                  value={editingOrg.name}
                  onChange={(e) => setEditingOrg({...editingOrg, name: e.target.value})}
                  placeholder="Hospital Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingOrg.address}
                  onChange={(e) => setEditingOrg({...editingOrg, address: e.target.value})}
                  placeholder="123 Healthcare Ave"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-latitude">Latitude</Label>
                  <Input
                    id="edit-latitude"
                    type="number"
                    step="any"
                    value={editingOrg.latitude}
                    onChange={(e) => setEditingOrg({...editingOrg, latitude: e.target.value})}
                    placeholder="40.7589"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-longitude">Longitude</Label>
                  <Input
                    id="edit-longitude"
                    type="number"
                    step="any"
                    value={editingOrg.longitude}
                    onChange={(e) => setEditingOrg({...editingOrg, longitude: e.target.value})}
                    placeholder="-73.9851"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-radius">Perimeter Radius (km)</Label>
                <Input
                  id="edit-radius"
                  type="number"
                  step="0.1"
                  value={editingOrg.radiusKm}
                  onChange={(e) => setEditingOrg({...editingOrg, radiusKm: e.target.value})}
                  placeholder="0.5"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Organization
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Organization Modal */}
      {showDeleteModal && orgToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Delete Organization</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{orgToDelete.name}</strong>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone. All associated data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteOrganization} className="bg-red-600 hover:bg-red-700">
                Delete Organization
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}