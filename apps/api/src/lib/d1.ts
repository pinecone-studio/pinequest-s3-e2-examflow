export type D1Result<T> = {
  results?: T[];
  success: boolean;
  meta: Record<string, unknown>;
};

export type D1PreparedStatementLike = {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<never>>;
};

export type D1DatabaseLike = {
  prepare(query: string): D1PreparedStatementLike;
  batch?<T = unknown>(
    statements: D1PreparedStatementLike[],
  ): Promise<Array<D1Result<T>>>;
};

export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const statement = (
  db: D1DatabaseLike,
  sql: string,
  params: unknown[] = [],
): D1PreparedStatementLike => {
  const prepared = db.prepare(sql);
  return params.length > 0 ? prepared.bind(...params) : prepared;
};

export const all = async <T>(
  db: D1DatabaseLike,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> => {
  const result = await statement(db, sql, params).all<T>();
  return result.results ?? [];
};

export const first = async <T>(
  db: D1DatabaseLike,
  sql: string,
  params: unknown[] = [],
): Promise<T | null> => statement(db, sql, params).first<T>();

export const run = async (
  db: D1DatabaseLike,
  sql: string,
  params: unknown[] = [],
): Promise<void> => {
  await statement(db, sql, params).run();
};

export const runMany = async (
  db: D1DatabaseLike,
  statements: Array<{ sql: string; params?: unknown[] }>,
): Promise<void> => {
  if (statements.length === 0) {
    return;
  }

  if (db.batch) {
    await db.batch(
      statements.map(({ sql, params = [] }) => statement(db, sql, params)),
    );
    return;
  }

  for (const { sql, params = [] } of statements) {
    await run(db, sql, params);
  }
};
