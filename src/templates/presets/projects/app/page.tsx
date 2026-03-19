import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Projects() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Management</h1>
          <p className="text-gray-600">Organize and track your projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Create projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and manage projects.</p>
              <Button>New Project</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Task tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and track project tasks.</p>
              <Button variant="outline">View Tasks</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Team collaboration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Collaborate with your team members.</p>
              <Button variant="outline">Team</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
