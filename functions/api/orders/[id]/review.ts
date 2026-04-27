interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const order_id = params.id;
  try {
    const data: any = await request.json();
    
    const id = data.id ?? crypto.randomUUID();
    const rating = data.rating;
    const comment = data.comment || '';
    const created_at = data.created_at || new Date().toISOString();

    if (rating === undefined) {
      return Response.json({ error: "Rating is required" }, { status: 400 });
    }

    await env.DB.prepare(
      "INSERT INTO reviews (id, order_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, order_id, rating, comment, created_at).run();

    return Response.json({ success: true, id, order_id }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
