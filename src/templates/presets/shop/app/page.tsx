import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Shop() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Your online marketplace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Browse catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Explore our product catalog.</p>
              <Button>Browse Products</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>Your cart items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage your shopping cart.</p>
              <Button variant="outline">View Cart</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Order history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Check your order history and status.</p>
              <Button variant="outline">Orders</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
