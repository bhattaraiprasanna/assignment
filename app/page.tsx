"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState(initialUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5
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

  const totalPages = Math.ceil(users.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.role) {
      errors.role = "Role is required"
    }

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

      console.log("Form submitted:", formData)
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

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-black">User Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple user management interface with modal form
          </p>
        </div>

        {/* Playground */}
        <Card> 
          <CardContent >
            <div className="text-center ">
              <Button size="lg" onClick={() => setIsModalOpen(true)} className="bg-black hover:bg-black-700">
                Add New User
              </Button>
            </div>

            <div className="mt-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
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

                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
                      Previous
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
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />

          {/* Modal */}
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Add New User</h2> 
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a role</option>
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.role && <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select country</option>
                      {countryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
