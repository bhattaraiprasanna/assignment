"use client"

import { useState } from "react"
import { DataTable, type DataTableColumn, type DataTablePagination } from "@/components/ui/data-table"
import { Modal, ConfirmModal } from "@/components/ui/modal"
import { TextInput, SelectInput, FileUpload, DatePicker, type SelectOption } from "@/components/ui/form-inputs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for demonstration
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", joinDate: "2023-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", joinDate: "2023-02-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive", joinDate: "2023-03-10" },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Moderator",
    status: "Active",
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
    joinDate: "2023-05-12",
  },
  { id: 6, name: "Diana Davis", email: "diana@example.com", role: "Admin", status: "Inactive", joinDate: "2023-06-18" },
  { id: 7, name: "Eve Miller", email: "eve@example.com", role: "User", status: "Active", joinDate: "2023-07-22" },
  { id: 8, name: "Frank Garcia", email: "frank@example.com", role: "User", status: "Active", joinDate: "2023-08-30" },
]

const roleOptions: SelectOption[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "guest", label: "Guest", disabled: true },
]

const countryOptions: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "au", label: "Australia" },
]

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState<"small" | "medium" | "large">("medium")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Form state for different demos
  const [basicFormData, setBasicFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [advancedFormData, setAdvancedFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    country: "",
    startDate: "",
    files: [] as File[],
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const pageSize = 5
  const totalUsers = sampleUsers.length

  // Sort data
  const sortedUsers = [...sampleUsers].sort((a, b) => {
    if (!sortKey) return 0

    const aValue = a[sortKey as keyof typeof a]
    const bValue = b[sortKey as keyof typeof b]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginate data
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const validateAdvancedForm = () => {
    const errors: Record<string, string> = {}

    if (!advancedFormData.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!advancedFormData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!advancedFormData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(advancedFormData.email)) {
      errors.email = "Email is invalid"
    }

    if (!advancedFormData.role) {
      errors.role = "Role is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAdvancedFormSubmit = () => {
    if (validateAdvancedForm()) {
      console.log("Advanced form submitted:", advancedFormData)
      setIsModalOpen(false)
      setAdvancedFormData({ firstName: "", lastName: "", email: "", role: "", country: "", startDate: "", files: [] })
      setFormErrors({})
    }
  }

  const ActionsMenu = ({ row }: { row: any }) => (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedUser(row)
          setAdvancedFormData({
            firstName: row.name.split(" ")[0],
            lastName: row.name.split(" ")[1] || "",
            email: row.email,
            role: row.role.toLowerCase(),
            country: "",
            startDate: row.joinDate,
            files: [],
          })
          setIsModalOpen(true)
        }}
      >
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedUser(row)
          setIsConfirmModalOpen(true)
        }}
      >
        Delete
      </Button>
    </div>
  )

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  )

  const columns: DataTableColumn[] = [
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: false },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    { key: "joinDate", label: "Join Date", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (row) => <ActionsMenu row={row} />,
    },
  ]

  const pagination: DataTablePagination = {
    page: currentPage,
    pageSize,
    total: totalUsers,
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Component Library</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional, accessible, and reusable UI components built with TypeScript and Tailwind CSS
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">A11y</div>
              <div className="text-sm text-muted-foreground">Accessible</div>
            </div>
          </div>
        </div>

        {/* Component Showcase */}
        <Tabs defaultValue="datatable" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="datatable">DataTable</TabsTrigger>
            <TabsTrigger value="modal">Modal</TabsTrigger>
            <TabsTrigger value="forms">Form Inputs</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
          </TabsList>

          {/* DataTable Tab */}
          <TabsContent value="datatable" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DataTable Component</CardTitle>
                <CardDescription>
                  A powerful data table with sorting, pagination, loading states, and custom renderers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-medium">Features Demonstrated:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sortable columns (click headers)</li>
                      <li>• Pagination controls</li>
                      <li>• Loading states with skeleton UI</li>
                      <li>• Custom cell renderers (Status badges, Action buttons)</li>
                      <li>• Empty state handling</li>
                      <li>• Responsive design</li>
                    </ul>
                  </div>
                  <Button onClick={() => setLoading(!loading)} variant="outline">
                    {loading ? "Stop Loading" : "Show Loading"}
                  </Button>
                </div>
                <DataTable
                  data={paginatedUsers}
                  columns={columns}
                  onSort={handleSort}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  loading={loading}
                  emptyMessage="No users found"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modal Tab */}
          <TabsContent value="modal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modal Component</CardTitle>
                <CardDescription>
                  Accessible modals with portal rendering, focus management, and keyboard navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Features Demonstrated:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Portal rendering (renders outside parent DOM)</li>
                      <li>• Focus management and tab trapping</li>
                      <li>• Keyboard navigation (Escape to close)</li>
                      <li>• Multiple sizes (small, medium, large)</li>
                      <li>• Body scroll lock when open</li>
                      <li>• Confirmation modal variant</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Modal Size:</label>
                      <div className="flex space-x-2">
                        {(["small", "medium", "large"] as const).map((size) => (
                          <Button
                            key={size} 
                            size="sm"
                            onClick={() => setModalSize(size)}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => setIsModalOpen(true)}>Open Modal ({modalSize})</Button>
                      <Button onClick={() => setIsConfirmModalOpen(true)}>
                        Confirmation Modal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Form Inputs Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Input Components</CardTitle>
                <CardDescription>
                  Comprehensive form inputs with validation, accessibility, and advanced features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Basic Form Inputs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <TextInput
                      label="Full Name"
                      value={basicFormData.name}
                      onChange={(value) => setBasicFormData({ ...basicFormData, name: value })}
                      placeholder="Enter your name"
                      required
                      helperText="This field is required"
                    />
                    <TextInput
                      label="Email"
                      type="email"
                      value={basicFormData.email}
                      onChange={(value) => setBasicFormData({ ...basicFormData, email: value })}
                      placeholder="Enter your email"
                      required
                    />
                    <TextInput
                      label="Password"
                      type="password"
                      value={basicFormData.password}
                      onChange={(value) => setBasicFormData({ ...basicFormData, password: value })}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Advanced Form Inputs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <SelectInput
                      label="Role (Searchable)"
                      value={advancedFormData.role}
                      onChange={(value) => setAdvancedFormData({ ...advancedFormData, role: value })}
                      options={roleOptions}
                      placeholder="Search and select role"
                      searchable
                      clearable
                      helperText="Type to search options"
                    />

                    <SelectInput
                      label="Country (No Search)"
                      value={advancedFormData.country}
                      onChange={(value) => setAdvancedFormData({ ...advancedFormData, country: value })}
                      options={countryOptions}
                      placeholder="Select country"
                      searchable={false}
                    />

                    <DatePicker
                      label="Start Date"
                      value={advancedFormData.startDate}
                      onChange={(value) => setAdvancedFormData({ ...advancedFormData, startDate: value })}
                      placeholder="Select date"
                      helperText="Choose your start date"
                    />

                    <div className="md:col-span-2">
                      <FileUpload
                        label="Document Upload (Drag & Drop)"
                        onChange={(files) => setAdvancedFormData({ ...advancedFormData, files })}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        multiple
                        maxFiles={3}
                        maxSize={5 * 1024 * 1024} // 5MB
                        helperText="Drag files here or click to browse. Max 3 files, 5MB each."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Input States</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <TextInput label="Normal State" value="" onChange={() => {}} placeholder="Normal input" />
                    <TextInput label="Error State" value="invalid@" onChange={() => {}} error="Invalid email format" />
                    <TextInput label="Disabled State" value="Disabled input" onChange={() => {}} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Playground</CardTitle>
                <CardDescription>Try out all components together in a realistic scenario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">User Management Dashboard</h3>
                  <p className="text-muted-foreground">
                    This playground demonstrates how all components work together in a real application
                  </p>
                  <Button size="lg" onClick={() => setIsModalOpen(true)}>
                    Add New User
                  </Button>
                </div>

                <DataTable
                  data={paginatedUsers}
                  columns={columns}
                  onSort={handleSort}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  loading={loading}
                  emptyMessage="No users found"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
          setAdvancedFormData({
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
        title={selectedUser ? `Edit ${selectedUser.name}` : "Add New User"}
        size={modalSize}
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              value={advancedFormData.firstName}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, firstName: value })}
              placeholder="Enter first name"
              required
              error={formErrors.firstName}
            />

            <TextInput
              label="Last Name"
              value={advancedFormData.lastName}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, lastName: value })}
              placeholder="Enter last name"
              required
              error={formErrors.lastName}
            />

            <TextInput
              label="Email Address"
              type="email"
              value={advancedFormData.email}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, email: value })}
              placeholder="Enter email"
              required
              error={formErrors.email}
            />

            <SelectInput
              label="Role"
              value={advancedFormData.role}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, role: value })}
              options={roleOptions}
              placeholder="Select a role"
              required
              searchable
              clearable
              error={formErrors.role}
            />

            <SelectInput
              label="Country"
              value={advancedFormData.country}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, country: value })}
              options={countryOptions}
              placeholder="Select country"
            />

            <DatePicker
              label="Start Date"
              value={advancedFormData.startDate}
              onChange={(value) => setAdvancedFormData({ ...advancedFormData, startDate: value })}
              placeholder="Select start date"
            />
          </div>

          <FileUpload
            label="Profile Documents"
            onChange={(files) => setAdvancedFormData({ ...advancedFormData, files })}
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            maxFiles={2}
            maxSize={10 * 1024 * 1024} // 10MB
            helperText="Upload profile documents (optional)"
          />

          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedUser(null)
                setAdvancedFormData({
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
            <Button onClick={handleAdvancedFormSubmit}>{selectedUser ? "Save Changes" : "Add User"}</Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={() => {
          console.log("Deleting user:", selectedUser)
          setSelectedUser(null)
        }}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </main>
  )
}
