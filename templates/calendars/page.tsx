import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Calendars() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Calendar Management</h1>
          <p className="text-gray-600">Schedule and organize events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and manage calendar events.</p>
              <Button>New Event</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendars</CardTitle>
              <CardDescription>Multiple calendars</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and organize multiple calendars.</p>
              <Button variant="outline">Manage</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
              <CardDescription>Event notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Set and manage event reminders.</p>
              <Button variant="outline">Reminders</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
