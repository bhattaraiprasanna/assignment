"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

const roleOptions = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "guest", label: "Guest", disabled: true },
]

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
]

const initialUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    firstName: "Alice",
    lastName: "Brown",
    email: "alice@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    firstName: "Charlie",
    lastName: "Wilson",
    email: "charlie@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-05-12",
  },
  {
    id: 6,
    firstName: "Emma",
    lastName: "Davis",
    email: "emma@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-06-18",
  },
  {
    id: 7,
    firstName: "Michael",
    lastName: "Miller",
    email: "michael@example.com",
    role: "moderator",
    status: "inactive",
    joinDate: "2023-07-22",
  },
  {
    id: 8,
    firstName: "Sarah",
    lastName: "Garcia",
    email: "sarah@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-08-14",
  },
  {
    id: 9,
    firstName: "David",
    lastName: "Martinez",
    email: "david@example.com",
    role: "admin",
    status: "active",
    joinDate: "2023-09-03",
  },
  {
    id: 10,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-10-11",
  },
  {
    id: 11,
    firstName: "James",
    lastName: "Taylor",
    email: "james@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-11-07",
  },
  {
    id: 12,
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2023-12-01",
  },
  {
    id: 13,
    firstName: "Robert",
    lastName: "Lee",
    email: "robert@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 14,
    firstName: "Jennifer",
    lastName: "White",
    email: "jennifer@example.com",
    role: "admin",
    status: "active",
    joinDate: "2024-02-08",
  },
  {
    id: 15,
    firstName: "William",
    lastName: "Harris",
    email: "william@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2024-03-12",
  },
]

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  status: string
  joinDate: string
}

interface SortConfig {
  key: keyof User
  direction: 'asc' | 'desc'
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(5)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    country: "",
    startDate: "",
    files: [] as File[],
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Sorting logic
  const sortedUsers = useMemo(() => {
    if (!sortConfig) return users
    const sorted = [...users].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [users, sortConfig])

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = sortedUsers.slice(startIndex, endIndex)

  const handleSort = (key: keyof User) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }
    if (!formData.role) errors.role = "Role is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormSubmit = () => {
    if (validateForm()) {
      const newUser = {
        id: users.length + 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        status: "active",
        joinDate: formData.startDate || new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
      setIsModalOpen(false)
      setFormData({ firstName: "", lastName: "", email: "", role: "", country: "", startDate: "", files: [] })
      setFormErrors({})
    }
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
    const newTotalPages = Math.ceil((users.length - 1) / usersPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Custom cell renderers
  const renderStatusBadge = (status: string) => (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )

  const renderRoleBadge = (role: string) => (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        role === "admin" ? "bg-blue-100 text-blue-800" :
        role === "moderator" ? "bg-purple-100 text-purple-800" :
        "bg-gray-100 text-gray-800"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-lg font-medium text-gray-600">No users found</p>
      <p className="text-sm text-gray-500 mt-2">Add a new user to get started</p>
      <Button
        className="mt-4 bg-black hover:bg-gray-800"
        onClick={() => setIsModalOpen(true)}
      >
        Add New User
      </Button>
    </div>
  )

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(usersPerPage)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/6" />
          <Skeleton className="h-8 w-1/6" />
          <Skeleton className="h-8 w-1/6" />
          <Skeleton className="h-8 w-1/6" />
        </div>
      ))}
    </div>
  )

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">User Management</h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage users with sorting, pagination, and responsive interface
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-black hover:bg-gray-800"
              >
                Add New User
              </Button>
              <Select
                value={usersPerPage.toString()}
                onValueChange={(value) => {
                  setUsersPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-32 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <LoadingSkeleton />
            ) : sortedUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {[
                          { key: 'firstName', label: 'Full Name' },
                          { key: 'email', label: 'Email' },
                          { key: 'role', label: 'Role' },
                          { key: 'status', label: 'Status' },
                          { key: 'joinDate', label: 'Join Date' },
                        ].map((column) => (
                          <th
                            key={column.key}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort(column.key as keyof User)}
                          >
                            <div className="flex items-center space-x-1">
                              <span>{column.label}</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-4 py-4 text-sm text-blue-600 break-all">
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                          </td>
                          <td className="px-4 py-4 text-sm">{renderRoleBadge(user.role)}</td>
                          <td className="px-4 py-4 text-sm">{renderStatusBadge(user.status)}</td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, sortedUsers.length)} of {sortedUsers.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-gray-300 hover:bg-gray-400 text-black" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold item-center mb-6">Add New User</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className="w-full"
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className="w-full"
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false)
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        role: "",
                        country: "",
                        startDate: "",
                        files: [],
                      })
                      setFormErrors({})
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleFormSubmit}>Add User</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}