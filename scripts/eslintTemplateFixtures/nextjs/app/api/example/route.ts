// Next.js calls every route handler as (request, context).
type ExampleRouteContextProps = {
	params: Promise<{ exampleId: string }>;
};

export const GET = async (
	request: Request,
	context: ExampleRouteContextProps,
) => {
	const { exampleId } = await context.params;
	return Response.json({ exampleId, url: request.url });
};
