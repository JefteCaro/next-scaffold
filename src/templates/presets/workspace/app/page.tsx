import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Workspace() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Workspace</h1>
          <p className="text-gray-600">Team collaboration and productivity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Team projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and manage team projects.</p>
              <Button>New Project</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage team members and roles.</p>
              <Button variant="outline">Manage Team</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Task management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and assign tasks.</p>
              <Button variant="outline">Tasks</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
