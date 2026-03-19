import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your analytics dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your profile and account settings.</p>
              <Button>Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View your analytics and performance insights.</p>
              <Button variant="outline">View Analytics</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Check your recent activity and notifications.</p>
              <Button variant="outline">View Activity</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
