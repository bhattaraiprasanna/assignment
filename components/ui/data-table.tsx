"use client"

import type React from "react"
import { useState } from "react"
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface DataTableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DataTablePagination {
  page: number
  pageSize: number
  total: number
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: DataTableColumn<T>[]
  onSort?: (key: string, direction: "asc" | "desc") => void
  pagination?: DataTablePagination
  onPageChange?: (page: number) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

interface SortState {
  key: string | null
  direction: "asc" | "desc"
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onSort,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: "asc" })

  const handleSort = (key: string) => {
    if (!columns.find((col) => col.key === key)?.sortable) return

    const newDirection = sortState.key === key && sortState.direction === "asc" ? "desc" : "asc"
    setSortState({ key, direction: newDirection })
    onSort?.(key, newDirection)
  }

  const getSortIcon = (key: string) => {
    if (sortState.key !== key) return null
    return sortState.direction === "asc" ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    )
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1
  const startItem = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1
  const endItem = pagination ? Math.min(pagination.page * pagination.pageSize, pagination.total) : data.length

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex space-x-4 py-4 border-b border-gray-200">
          {columns.map((column) => (
            <div key={column.key} className="flex-1">
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-gray-500 text-lg">{emptyMessage}</p>
    </div>
  )

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  role={column.sortable ? "button" : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault()
                      handleSort(column.key)
                    }
                  }}
                  aria-sort={
                    sortState.key === column.key
                      ? sortState.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : column.sortable
                        ? "none"
                        : undefined
                  }
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {getSortIcon(column.key) || (
                          <div className="opacity-30">
                            <ChevronUpIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <LoadingSkeleton />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState />
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors" role="row">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ""}`}
                      role="cell"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startItem} to {endItem} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page <= 1}
                aria-label="Previous page"
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum} 
                      size="sm"
                      onClick={() => onPageChange?.(pageNum)}
                      className={`w-8 h-8 p-0 ${
                        pagination.page === pageNum
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={pagination.page === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                aria-label="Next page"
                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
