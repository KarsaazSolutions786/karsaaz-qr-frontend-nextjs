'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'

export function AccountCreditCart() {
  const { cartItems, balance, cartTotal, amountToPay, updateQuantity, removeFromCart, clearCart } = useAccountCredit()

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Cart Items</h3>
          <button onClick={clearCart} className="text-xs text-red-600 hover:text-red-700">
            Clear All
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {cartItems.map((item) => (
          <div key={item.type} className="flex items-center justify-between px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">
                ${item.unitPrice.toFixed(2)} each
                {item.isDynamic && <span className="ml-1 text-blue-600">(Dynamic)</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.type, item.quantity - 1)}
                className="rounded-md border border-gray-200 p-1 hover:bg-gray-50"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.type, item.quantity + 1)}
                className="rounded-md border border-gray-200 p-1 hover:bg-gray-50"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                onClick={() => removeFromCart(item.type)}
                className="ml-2 rounded-md p-1 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="ml-4 w-20 text-right text-sm font-semibold text-gray-900">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-4 py-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Account Balance</span>
          <span className="font-medium text-green-600">-${Math.min(balance, cartTotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-1">
          <span>Amount to Pay</span>
          <span>${amountToPay.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
