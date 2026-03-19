import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Payment() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Processing</h1>
          <p className="text-gray-600">Secure payment solutions for your business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Make Payment</CardTitle>
              <CardDescription>Process transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Process a new payment or transaction.</p>
              <Button>New Payment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View all your payment transactions.</p>
              <Button variant="outline">View History</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Billing documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage and download invoices.</p>
              <Button variant="outline">Invoices</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
