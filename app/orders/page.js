import { Suspense } from "react";
import { getDB } from "@/lib/mongodb";
import { seedOrders as staticSeedOrders } from "@/lib/seedOrders";
import OrdersClient from "@/components/OrdersClient";

/** Lee seed orders desde MongoDB; si falla usa los estáticos */
async function fetchSeedOrders() {
  try {
    const db = await getDB();
    const docs = await db.collection("origin_orders").find({}).toArray();
    if (!docs.length) return staticSeedOrders;
    // Serializar ObjectId y asegurar que los _id de productos embebidos sean strings
    return docs.map(({ _id, items, ...rest }) => ({
      ...rest,
      _id: _id.toString(),
      items: items.map(({ product, quantity }) => ({
        quantity,
        product: { ...product, _id: product._id?.toString?.() ?? undefined },
      })),
    }));
  } catch {
    return staticSeedOrders;
  }
}

export default async function OrdersPage() {
  const seedOrders = await fetchSeedOrders();
  return (
    <Suspense>
      <OrdersClient seedOrders={seedOrders} />
    </Suspense>
  );
}
