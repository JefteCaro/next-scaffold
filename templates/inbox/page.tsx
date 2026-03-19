import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Inbox() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inbox</h1>
          <p className="text-gray-600">Manage your messages and notifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Email & messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Read and manage your messages.</p>
              <Button>Read Messages</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Alert management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your notifications and alerts.</p>
              <Button variant="outline">Notifications</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spam</CardTitle>
              <CardDescription>Filter settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage spam and filter settings.</p>
              <Button variant="outline">Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
