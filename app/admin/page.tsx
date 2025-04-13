"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Search, UserPlus, Filter } from "lucide-react"

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Example user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", fields: 3, lastActive: "2023-04-10" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", fields: 5, lastActive: "2023-04-12" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", fields: 2, lastActive: "2023-04-08" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", fields: 4, lastActive: "2023-04-11" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", fields: 1, lastActive: "2023-04-09" },
  ]

  // Example analytics data
  const fieldsByRegion = [
    { name: "Central", value: 35 },
    { name: "Eastern", value: 25 },
    { name: "Western", value: 20 },
    { name: "Southern", value: 15 },
    { name: "Northern", value: 5 },
  ]

  const cropDistribution = [
    { name: "Maize", value: 45 },
    { name: "Soybeans", value: 20 },
    { name: "Cotton", value: 15 },
    { name: "Wheat", value: 10 },
    { name: "Other", value: 10 },
  ]

  const userGrowth = [
    { month: "Jan", users: 10 },
    { month: "Feb", users: 15 },
    { month: "Mar", users: 25 },
    { month: "Apr", users: 40 },
    { month: "May", users: 55 },
    { month: "Jun", users: 75 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updateSentinelCredentials = async () => {
    const clientId = (document.getElementById("sentinel-client-id") as HTMLInputElement).value
    const clientSecret = (document.getElementById("sentinel-client-secret") as HTMLInputElement).value

    try {
      const response = await fetch("/api/admin/update-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
        }),
      })

      if (response.ok) {
        alert("Sentinel Hub credentials updated successfully")
      } else {
        alert("Failed to update credentials")
      }
    } catch (error) {
      console.error("Error updating credentials:", error)
      alert("An error occurred while updating credentials")
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">86% of total fields</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fields}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userGrowth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fields by Region</CardTitle>
                <CardDescription>Distribution of monitored fields by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fieldsByRegion}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {fieldsByRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crop Distribution</CardTitle>
                <CardDescription>Types of crops being monitored</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>API requests by endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Sentinel Hub</div>
                      <div className="text-sm text-muted-foreground">65%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Weather API</div>
                      <div className="text-sm text-muted-foreground">25%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "25%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Analytics Engine</div>
                      <div className="text-sm text-muted-foreground">10%</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API keys and integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sentinel Hub API</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Client ID"
                      id="sentinel-client-id"
                      defaultValue={process.env.SENTINEL_HUB_CLIENT_ID || ""}
                    />
                    <Button variant="outline" size="sm" onClick={() => updateSentinelCredentials()}>
                      Save
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      placeholder="Client Secret"
                      id="sentinel-client-secret"
                      defaultValue={process.env.SENTINEL_HUB_CLIENT_SECRET ? "••••••••••••••••" : ""}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Enter your Sentinel Hub OAuth credentials. These will be used to authenticate API requests.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Weather API</h3>
                <div className="flex items-center gap-2">
                  <Input type="password" value="••••••••••••••••" readOnly />
                  <Button variant="outline" size="sm">
                    Reveal
                  </Button>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Data Refresh Interval</h3>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="24" />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Enable User Registration</h3>
                  <p className="text-sm text-muted-foreground">Allow new users to register</p>
                </div>
                <div className="flex h-6 items-center">
                  <input
                    type="checkbox"
                    id="user-registration"
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Require Admin Approval</h3>
                  <p className="text-sm text-muted-foreground">New users require admin approval</p>
                </div>
                <div className="flex h-6 items-center">
                  <input type="checkbox" id="admin-approval" className="h-4 w-4 rounded border-gray-300" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Enable Analytics</h3>
                  <p className="text-sm text-muted-foreground">Collect anonymous usage data</p>
                </div>
                <div className="flex h-6 items-center">
                  <input type="checkbox" id="analytics" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                </div>
              </div>

              <Button className="mt-4">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
