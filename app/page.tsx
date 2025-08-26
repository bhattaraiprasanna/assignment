"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, ShoppingCart, Zap, Palette } from "lucide-react"
import Task1UserManagement from "@/components/task1-user-management" 
import Task2CartManagement from "@/components/task2-cart-management"
import Task3PerformanceOptimization from "@/components/task3-performance-optimization"

type TaskType = "overview" | "task1" | "task2" | "task3" | "task4"

const tasks = [
  {
    id: "task1" as TaskType,
    title: "Reusable Component Library",
    description: "Advanced user management system with sorting, pagination, and form validation",
    icon: Users,
    color: "bg-blue-500", 
  },
  {
    id: "task2" as TaskType,
    title: "Complex State Management",
    description: "Shopping cart with optimistic updates, error recovery, and localStorage persistence",
    icon: ShoppingCart,
    color: "bg-green-500", 
  },
  {
    id: "task3" as TaskType,
    title: "Performance Optimization",
    description: "React optimization techniques with large datasets and memoization",
    icon: Zap,
    color: "bg-yellow-500", 
  },
  {
    id: "task4" as TaskType,
    title: "White-Label Configuration",
    description: "Customizable theming system with live preview and export functionality",
    icon: Palette,
    color: "bg-purple-500", 
  },
]

export default function Home() {
  const [currentTask, setCurrentTask] = useState<TaskType>("overview")

  const renderTaskContent = () => {
    switch (currentTask) {
      case "task1":
         return <Task1UserManagement />
      case "task2":
        return <Task2CartManagement />
      case "task3":
       return <Task3PerformanceOptimization />
      // case "task4":
      //   return <Task4WhiteLabel />
      default:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-black">Technical Assessment</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete these four tasks to demonstrate your React and Next.js expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task) => {
                const IconComponent = task.icon
                return (
                  <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${task.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl text-black">{task.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{task.description}</p>
                      <Button
                        onClick={() => setCurrentTask(task.id)}
                        className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                      >
                        See Task
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div> 
          </div>
        )
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {currentTask !== "overview" && (
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentTask("overview")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Overview
          </Button>
        </div>
      )}

      {renderTaskContent()}
    </main>
  )
}
