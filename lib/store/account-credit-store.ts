import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  type: string
  name: string
  quantity: number
  unitPrice: number
  isDynamic: boolean
}

interface AccountCreditState {
  balance: number
  cartItems: CartItem[]
  setBalance: (balance: number) => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (type: string) => void
  updateQuantity: (type: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number
  amountToPay: () => number
}

export const useAccountCreditStore = create<AccountCreditState>()(
  persist(
    (set, get) => ({
      balance: 0,
      cartItems: [],
      setBalance: (balance) => set({ balance }),
      addToCart: (item) =>
        set((state) => {
          const existing = state.cartItems.find((i) => i.type === item.type)
          if (existing) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.type === item.type ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] }
        }),
      removeFromCart: (type) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.type !== type),
        })),
      updateQuantity: (type, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.type === type ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
      cartTotal: () => get().cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      amountToPay: () => Math.max(0, get().cartTotal() - get().balance),
    }),
    {
      name: 'account-credit-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
