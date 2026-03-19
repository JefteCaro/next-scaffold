import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Ecommerce() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">E-Commerce Platform</h1>
          <p className="text-gray-600">Complete online commerce solution</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Catalog</CardTitle>
              <CardDescription>Manage products</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Add and manage your product catalog.</p>
              <Button>Manage Catalog</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Track and manage customer orders.</p>
              <Button variant="outline">View Orders</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Sales insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View your sales and performance metrics.</p>
              <Button variant="outline">Analytics</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
