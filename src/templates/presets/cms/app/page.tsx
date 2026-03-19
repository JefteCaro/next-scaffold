import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CMS() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Management System</h1>
          <p className="text-gray-600">Manage your content and media</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
              <CardDescription>Create & edit content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Write and publish articles for your audience.</p>
              <Button>New Article</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Manage files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Upload and organize your media files.</p>
              <Button variant="outline">Upload Media</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Schedule content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Schedule and publish your content.</p>
              <Button variant="outline">Schedule</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
