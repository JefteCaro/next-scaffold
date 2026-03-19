import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CRM() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM System</h1>
          <p className="text-gray-600">Customer Relationship Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Manage contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Add and manage customer contacts.</p>
              <Button>New Contact</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deals</CardTitle>
              <CardDescription>Sales pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Track and manage your sales deals.</p>
              <Button variant="outline">View Deals</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Sales insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Generate and view sales reports.</p>
              <Button variant="outline">Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
