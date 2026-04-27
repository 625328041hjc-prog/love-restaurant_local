interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  try {
    const { results: orders } = await env.DB.prepare(
      "SELECT * FROM orders ORDER BY created_at DESC"
    ).all();

    if (!orders || orders.length === 0) {
      return Response.json([]);
    }

    const orderIds = orders.map((o: any) => o.id);
    // D1 binding limit workaround or just use batch, but for simple IN clause it's fine if not too many
    // Alternatively, just fetch all items and reviews and filter in memory, which is safer if orders is large
    const { results: items } = await env.DB.prepare(`
      SELECT oi.*, d.name 
      FROM order_items oi
      LEFT JOIN dishes d ON oi.dish_id = d.id
    `).all();
    const { results: reviews } = await env.DB.prepare("SELECT * FROM reviews").all();

    const ordersWithDetails = orders.map((order: any) => ({
      ...order,
      items: items.filter((item: any) => item.order_id === order.id),
      reviews: reviews.filter((review: any) => review.order_id === order.id)
    }));

    return Response.json(ordersWithDetails);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  try {
    const data: any = await request.json();
    
    const status = data.status || 'new';
    const note = data.note || '';
    const created_at = data.created_at || new Date().toISOString();

    const { results } = await env.DB.prepare(
      "INSERT INTO orders (note, status, created_at) VALUES (?, ?, ?) RETURNING id"
    ).bind(note, status, created_at).all();

    const orderId = results?.[0]?.id;

    if (!orderId) {
      throw new Error("Failed to insert order");
    }

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        await env.DB.prepare(
          "INSERT INTO order_items (order_id, dish_id, qty, price) VALUES (?, ?, ?, ?)"
        ).bind(orderId, item.dish_id, item.qty, item.price).run();
      }
    }

    return Response.json({ success: true, id: orderId }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
