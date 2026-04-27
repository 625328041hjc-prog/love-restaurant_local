interface Env {
  DB: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const id = params.id;
  try {
    const data: any = await request.json();
    
    const updates: string[] = [];
    const values: any[] = [];
    
    const fields = ['name', 'image_url', 'price', 'method', 'is_active'];
    for (const field of fields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(data[field]);
      }
    }
    
    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }
    
    values.push(id);
    
    const query = `UPDATE dishes SET ${updates.join(', ')} WHERE id = ?`;
    await env.DB.prepare(query).bind(...values).run();
    
    return Response.json({ success: true, id });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { env, params } = context;
  const id = params.id;
  try {
    await env.DB.prepare(
      "UPDATE dishes SET is_active = 0 WHERE id = ?"
    ).bind(id).run();
    
    return Response.json({ success: true, id });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
