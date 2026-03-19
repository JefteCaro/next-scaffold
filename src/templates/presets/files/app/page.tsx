import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Files() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">File Manager</h1>
          <p className="text-gray-600">Organize and manage your files</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Files</CardTitle>
              <CardDescription>Your files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Browse and organize your files.</p>
              <Button>Browse Files</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shared</CardTitle>
              <CardDescription>Shared items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Access files shared with you.</p>
              <Button variant="outline">View Shared</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>Usage info</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Check storage usage and plans.</p>
              <Button variant="outline">Storage</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
