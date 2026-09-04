const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'qf5spdw9',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  const post = await client.fetch(`*[_id == "YYhpsUQamkrk945JzBUOPU"][0]`);
  console.log(JSON.stringify(post.body, null, 2));
}
main();
