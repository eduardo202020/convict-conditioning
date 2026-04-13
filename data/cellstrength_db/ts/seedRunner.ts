import * as SQLite from "expo-sqlite";
import seed from "../seed-data.json";

/**
 * Opción B: Sembrar desde JSON (si NO quieres DB prebuilt)
 * - Ejecuta schema.sql con db.execAsync / transaction
 * - Luego inserts desde seed-data.json
 */
export async function runSeed(db: SQLite.SQLiteDatabase) {
  // Implementa aquí si quieres sembrar desde JSON en runtime.
  // Sugerencia: usa una transacción y prepared statements.
  console.log("seed payload", seed.movements.length, seed.steps.length, seed.targets.length);
}
