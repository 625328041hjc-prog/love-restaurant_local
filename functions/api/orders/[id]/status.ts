interface Env {
  DB: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const id = params.id;
  try {
    const data: any = await request.json();
    const status = data.status;

    if (!status) {
      return Response.json({ error: "Status is required" }, { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE orders SET status = ? WHERE id = ?"
    ).bind(status, id).run();

    return Response.json({ success: true, id, status });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
