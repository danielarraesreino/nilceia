import { getAllPosts } from '../src/lib/sanity';
async function test() {
  try {
    const posts = await getAllPosts();
    console.log("Posts fetched:", posts.length);
    if(posts.length > 0) {
      console.log(posts[0].title);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
