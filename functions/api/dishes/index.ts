interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM dishes WHERE is_active = 1 ORDER BY created_at DESC"
    ).all();
    return Response.json(results);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  try {
    const data: any = await request.json();
    
    // Fallback values if not provided
    const is_active = data.is_active !== undefined ? data.is_active : 1;
    const created_at = data.created_at || new Date().toISOString();

    const { results } = await env.DB.prepare(
      "INSERT INTO dishes (name, image_url, price, method, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id"
    ).bind(data.name, data.image_url, data.price, data.method, is_active, created_at).all();

    const insertedId = results?.[0]?.id;

    return Response.json({ success: true, id: insertedId }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
