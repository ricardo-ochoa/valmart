/**
 * GET /api/seed
 * Puebla origin_catalog y origin_orders en MongoDB.
 * Protegido con SEED_SECRET — solo úsalo una vez.
 * Ejemplo: /api/seed?secret=tu_secreto
 */
import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { products } from "@/lib/products";
import { seedOrders } from "@/lib/seedOrders";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = await getDB();

    // origin_catalog
    const catalogCol = db.collection("origin_catalog");
    await catalogCol.deleteMany({});
    const catalogResult = await catalogCol.insertMany(products);

    // origin_orders
    const ordersCol = db.collection("origin_orders");
    await ordersCol.deleteMany({});
    const ordersResult = await ordersCol.insertMany(seedOrders);

    return NextResponse.json({
      ok: true,
      products: catalogResult.insertedCount,
      orders: ordersResult.insertedCount,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
