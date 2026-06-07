import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("MONGODB_URI no está definido en las variables de entorno");

// En desarrollo reutilizamos la conexión entre recargas de HMR
// En producción cada instancia de la función crea su propio cliente
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

/** Devuelve la instancia de la base de datos configurada en MONGODB_DB */
export async function getDB() {
  const client = await clientPromise;
  return client.db(dbName);
}
