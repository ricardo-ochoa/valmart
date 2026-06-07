"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const StoreContext = createContext(null);

const ORDERS_KEY = "valmart_orders";

const initialState = {
  cart: [],
  orders: [],
};

function storeReducer(state, action) {
  switch (action.type) {
    case "LOAD_ORDERS":
      return { ...state, orders: action.orders };
    case "ADD_TO_CART": {
      const existing = state.cart.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.product, quantity: 1 }],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.product.id !== action.productId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "PLACE_ORDER": {
      const updated = [action.order, ...state.orders];
      return { ...state, cart: [], orders: updated };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Load persisted orders on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) {
        const orders = JSON.parse(stored);
        if (Array.isArray(orders) && orders.length > 0) {
          dispatch({ type: "LOAD_ORDERS", orders });
        }
      }
    } catch (_) {}
  }, []);

  // Persist orders whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders));
    } catch (_) {}
  }, [state.orders]);

  const addToCart = (product) => dispatch({ type: "ADD_TO_CART", product });
  const removeFromCart = (productId) => dispatch({ type: "REMOVE_FROM_CART", productId });
  const updateQuantity = (productId, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const placeOrder = (customerInfo) => {
    const statuses = ["Procesando", "En camino", "Entregado"];
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: [...state.cart],
      total: state.cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      customerName: customerInfo.name,
      address: customerInfo.address,
      cardLast4: customerInfo.cardNumber.replace(/\s/g, "").slice(-4),
    };
    dispatch({ type: "PLACE_ORDER", order });
    return order;
  };

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart: state.cart,
        orders: state.orders,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
