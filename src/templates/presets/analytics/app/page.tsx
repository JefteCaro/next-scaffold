import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Analytics() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-lime-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Platform</h1>
          <p className="text-gray-600">Data insights and business intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboards</CardTitle>
              <CardDescription>Custom dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create and customize your dashboards.</p>
              <Button>New Dashboard</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Data reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Generate detailed data reports.</p>
              <Button variant="outline">Reports</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>Connect integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Connect and manage data sources.</p>
              <Button variant="outline">Sources</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
