"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AccountCreditCartPage() {
  // Mock cart items
  const cartItems = [
    { id: 1, name: "Dynamic QR Code Credit", price: 10.00, quantity: 1 },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8" />
        Shopping Cart
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter className="flex-col gap-4 border-t pt-6">
            <div className="flex justify-between w-full text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg">Checkout</Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="mt-4 text-center">
        <Link href="/pricing" className="text-sm text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
