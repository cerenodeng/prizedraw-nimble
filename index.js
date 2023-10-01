import { Database } from 'bun:sqlite';

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
	} else if (url.pathname.startsWith('/assets/') && request.method === 'GET') {
		return new Response(Bun.file('.' + url.pathname));
	} else if (url.pathname === '/users' && request.method === 'POST') {
		const formData = await request.formData();
		const fullName = formData.get('fullName');
		const database = new Database('prizedraw.sqlite');
		let query = database.query(`insert into users (fullName) values ($fullName)`);
		query.all({ $fullName: fullName });
		query = database.query('select * from users');
		const data = query.all();
		console.log(data);
		let output = '<ul>';
		for (const item of data) {
			output += `<li>${item.fullName}</li>`;
		}
		output += '</ul>';
		database.close();
		return new Response(output);
	}
	return new Response(Bun.file('404.html'), { status: 404 });
}
