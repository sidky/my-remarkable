import {Application, Router} from "https://deno.land/x/oak/mod.ts"; 

type Book = {
    id: number;
    title: string;
    author: string;
}

const books: Book[] = [
    {
        id: 1,
        title: 'The Hobbit',
        author: 'J. R. R. Tolkien'
    }
];

const app = new Application();

const router = new Router();

router
    .get('/', (context) => {
      context.response.body = "Hello, World!";
    })
    .get('/book', (context) => {
      context.response.body = books;  
    })
    .get('/book/:id', (context) => {
      if (context.params && context.params.id) {
          const id = context.params.id;
          context.response.body = books.find(book => book.id == parseInt(id));
      }
    })
    .post('/book', async (context) => {
        const req = await context.request.body({type: "json"});

        console.log(`req: ${ req }`);
        const body = await req.value;
        console.log(`body: ${ body }`);
 
        if (!body.title || !body.author) {
            context.response.status = 400;
            return;
        }

        const newBook: Book = {
            id: 2,
            title: body.title,
            author: body.author,
        };
        books.push(newBook);
        context.response.status = 201;
    });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
