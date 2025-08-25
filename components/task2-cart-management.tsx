"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, Trash2, X, Undo2 } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartTotals {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

interface CartState {
  items: CartItem[]
  discountCode: string
  discountAmount: number
  totals: CartTotals
  isLoading: boolean
  errors: string[]
}

const sampleProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", price: 99.99, image: "/product-placeholder.svg", category: "Electronics" },
  { id: "2", name: "Smart Watch", price: 199.99, image: "/product-placeholder.svg", category: "Electronics" },
  { id: "3", name: "Coffee Mug", price: 14.99, image: "/product-placeholder.svg", category: "Home" },
  { id: "4", name: "Notebook", price: 8.99, image: "/product-placeholder.svg", category: "Office" },
  { id: "5", name: "Bluetooth Speaker", price: 79.99, image: "/product-placeholder.svg", category: "Electronics" },
  { id: "6", name: "Desk Lamp", price: 34.99, image: "/product-placeholder.svg", category: "Home" },
]

const discountCodes = {
  SAVE10: 0.1,
  WELCOME20: 0.2,
  STUDENT15: 0.15,
}

export default function CartManagement() {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    discountCode: "",
    discountAmount: 0,
    totals: { subtotal: 0, tax: 0, shipping: 0, total: 0 },
    isLoading: false,
    errors: [],
  })
  const [cartOpen, setCartOpen] = useState(false) 
  const [discountInput, setDiscountInput] = useState("")

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCartState((prev) => ({ ...prev, items: parsed.items || [] }))
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify({ items: cartState.items }))
    calculateTotals()
  }, [cartState.items, cartState.discountAmount])

  const calculateTotals = useCallback(() => {
    const subtotal = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = subtotal * cartState.discountAmount
    const discountedSubtotal = subtotal - discountAmount
    const tax = discountedSubtotal * 0.08 // 8% tax
    const shipping = discountedSubtotal > 50 ? 0 : 9.99 
    const total = discountedSubtotal + tax + shipping

    setCartState((prev) => ({
      ...prev,
      totals: { subtotal, tax, shipping, total },
    }))
  }, [cartState.items, cartState.discountAmount])

  const addToCart = (product: Product) => {
    setCartState((prev) => {
      const existingItem = prev.items.find((item) => item.id === product.id)
      let newItems

      if (existingItem) {
        newItems = prev.items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        newItems = [...prev.items, { ...product, quantity: 1 }]
      }
 

      return { ...prev, items: newItems, errors: [] }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setCartState((prev) => {
      const oldItem = prev.items.find((item) => item.id === id)
      const newItems = prev.items.map((item) => (item.id === id ? { ...item, quantity } : item))
 
      return { ...prev, items: newItems }
    })
  }

  const removeItem = (id: string) => {
    setCartState((prev) => {
      const itemToRemove = prev.items.find((item) => item.id === id)
      const newItems = prev.items.filter((item) => item.id !== id)  
      return { ...prev, items: newItems }
    })
  }

  const applyDiscount = () => {
    const code = discountInput.toUpperCase()
    if (discountCodes[code as keyof typeof discountCodes]) {
      setCartState((prev) => ({
        ...prev,
        discountCode: code,
        discountAmount: discountCodes[code as keyof typeof discountCodes],
        errors: [],
      }))
      setDiscountInput("")
    } else {
      setCartState((prev) => ({
        ...prev,
        errors: ["Invalid discount code"],
      }))
    }
  } 

  const handleCheckout = () => {
    setCartState((prev) => ({ ...prev, isLoading: true }))

    // Simulate checkout process
    setTimeout(() => {
      setCartState((prev) => ({
        ...prev,
        isLoading: false,
        items: [],
        discountCode: "",
        discountAmount: 0,
      }))
      setCartOpen(false)
      alert("Checkout successful!")
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Shopping Cart System</h1>
        <p className="text-muted-foreground">Advanced state management with optimistic updates and error recovery</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
                             <Image
                 src={product.image || "/product-placeholder.svg"}
                 alt={product.name}
                 width={300}
                 height={300}
                 className="w-full h-full object-cover hover:scale-105 transition-transform"
                 onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   target.src = "/product-placeholder.svg";
                 }}
               />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-black">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold">${product.price}</span>
                <Button onClick={() => addToCart(product)} size="sm">
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Button */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setCartOpen(true)} size="lg" className="rounded-full shadow-lg">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({cartState.items.reduce((sum, item) => sum + item.quantity, 0)})
        </Button>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="relative ml-auto w-full max-w-md bg-background shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <Button variant="ghost" size="sm" onClick={() => setCartOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartState.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    {cartState.errors.map((error, index) => (
                      <p key={index} className="text-red-600 text-sm">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                {cartState.items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3">
                                             <Image
                         src={item.image || "/product-placeholder.svg"}
                         alt={item.name}
                         width={48}
                         height={48}
                         className="w-12 h-12 rounded object-cover"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = "/product-placeholder.svg";
                         }}
                       />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartState.items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  {/* Discount Code */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Discount code"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && applyDiscount()}
                      />
                      <Button onClick={applyDiscount} variant="outline">
                        Apply
                      </Button>
                    </div>
                    {cartState.discountCode && (
                      <p className="text-sm text-green-600">
                        Discount "{cartState.discountCode}" applied ({(cartState.discountAmount * 100).toFixed(0)}% off)
                      </p>
                    )}
                  </div>

                  {/* Cart Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${cartState.totals.subtotal.toFixed(2)}</span>
                    </div>
                    {cartState.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${(cartState.totals.subtotal * cartState.discountAmount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${cartState.totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {cartState.totals.shipping === 0 ? "Free" : `$${cartState.totals.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${cartState.totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full" disabled={cartState.isLoading}>
                    {cartState.isLoading ? "Processing..." : "Checkout"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
