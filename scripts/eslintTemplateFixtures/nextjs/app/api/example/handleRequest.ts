// Outside route.ts, two parameters must still be an error.
export const handleRequest = (request: Request, exampleId: string) =>
	Response.json({ exampleId, url: request.url });
