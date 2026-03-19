import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VideoCall() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Video Call Platform</h1>
          <p className="text-gray-600">High-quality video conferencing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Call</CardTitle>
              <CardDescription>Begin a new call</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Start a new video call with your contacts.</p>
              <Button>New Call</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Call history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View your recent call history.</p>
              <Button variant="outline">View History</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Manage contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Organize and manage your contacts.</p>
              <Button variant="outline">Manage</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
