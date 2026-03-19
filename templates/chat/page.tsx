import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Chat() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Chat Application</h1>
          <p className="text-gray-600">Connect and communicate with your contacts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>Your chat history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage your conversations.</p>
              <Button>Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Your contacts list</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Add and manage your contacts.</p>
              <Button variant="outline">Add Contact</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Adjust your chat preferences.</p>
              <Button variant="outline">Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
