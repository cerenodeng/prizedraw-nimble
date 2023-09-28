const server = Bun.serve({
	hostname: 'localhost',
	port: '3300',
	fetch: fetchHandler,
});
console.log(`Prize Draw Nimble is running on ${server.hostname}:${server.port}`);

async function fetchHandler(request) {
	const url = new URL(request.url);
	if (url.pathname === '/') {
		return new Response(Bun.file('index.html'));
	}
	return new Response(Bun.file('404.html'), { status: 404 });
}
