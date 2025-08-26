"use client";
import React, { useState, useMemo, useCallback } from "react";

//  Define types
interface User {
  id: string;
  name: string;
  email: string;
  department: string; 
  lastLogin: string;
  isActive?: boolean;
}

interface Department {
  id: string;
  name: string;
}

interface UserCardProps {
  user: User;
  department?: Department;
  onClick: () => void;
}

interface OptimizedUserListProps {
  users: User[];
  departments: Department[];
  onUserSelect: (user: User) => void;
}

//  Optimized UserCard with React.memo
const UserCard: React.FC<UserCardProps> = React.memo(({ user, department, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        backgroundColor: user.isActive ? "#e8f5e8" : "#f5f5f5",
        cursor: "pointer",
      }}
    >
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Department: {department?.name || "Unknown"}</p>
      <p>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</p>
      <span>{user.isActive ? "Active" : "Inactive"}</span>
    </div>
  );
});

const OptimizedUserList: React.FC<OptimizedUserListProps> = ({
  users,
  departments,
  onUserSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
 //makes lookup O(1) instead of scanning with .find.
  const departmentMap: Record<string, Department> = useMemo(() => {
    const map: Record<string, Department> = {};
    departments.forEach((d: Department) => {
      map[d.id] = d;
    });
    return map;
  }, [departments]); 
  //prviously filters were used filter → loops over all users every render  sort → expensive (O(n log n)), runs every render, even if data didn’t change
  //and using memo fixes and optizes the code Only recalculates when users, searchTerm, or selectedDepartment change
  const processedUsers: User[] = useMemo(() => {
    const now = new Date();
    return users
      .filter((user: User) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment =
          selectedDepartment === "all" || user.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
      })
      .map((user: User) => ({
        ...user,
        isActive: now.getTime() - new Date(user.lastLogin).getTime() <
          30 * 24 * 60 * 60 * 1000,
      }))
      .sort(
        (a: User, b: User) =>
          new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
      );
  }, [users, searchTerm, selectedDepartment]);

  //  previosly onUserSelect(user) → creates a new function every render  and due to which departments.find(...) also creates new functuin in each render
  //usecallback fixes and optimizes the code as it keeps reference stable
  const handleUserSelect = useCallback(
    (user: User) => {
      onUserSelect(user);
    },
    [onUserSelect]
  );

  return (
    <div>
      <h2>User List</h2>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        style={{ padding: "5px", marginRight: "10px" }}
      />

      <select
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="all">All Departments</option>
        {departments.map((dept: Department) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <div>
        {processedUsers.map((user: User) => (
          <UserCard
            key={user.id}
            user={user}
            department={departmentMap[user.department]}
            onClick={() => handleUserSelect(user)}
          />
        ))}
      </div>
    </div>
  );
};

const mockDepartments: Department[] = [
  { id: "it", name: "IT" },
  { id: "hr", name: "HR" },
  { id: "sales", name: "Sales" },
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "it",
    lastLogin: "2025-08-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    department: "hr",
    lastLogin: "2025-07-10T08:30:00Z",
  },
  {
    id: "3",
    name: "Charlie Davis",
    email: "charlie@example.com",
    department: "sales",
    lastLogin: "2025-08-25T14:00:00Z",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    department: "it",
    lastLogin: "2024-12-15T12:00:00Z",
  },
];

//  Demo App wrapper
const App: React.FC = () => {
  const handleSelect = (user: User) => {
    alert(`Selected user: ${user.name}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <OptimizedUserList
        users={mockUsers}
        departments={mockDepartments}
        onUserSelect={handleSelect}
      />
    </div>
  );
};

export default App;
