import {Application, Router} from "https://deno.land/x/oak/mod.ts"; 
import logger from "https://deno.land/x/oak_logger/mod.ts";
import { parse } from 'https://deno.land/std/flags/mod.ts'; 
import { Remarkable } from './remarkable/remarkable.ts';
import { DeviceManager } from './devicemanager/devicemanager.ts';

const { args } = Deno;
const DEFAULT_PORT = 8000;
const argPort = parse(args).port;

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

await new DeviceManager().init();

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
    .post('/remarkable/register', async (context) => {
        const body = await context.request.body({type: "form-data"});
        const deviceReq = await body.value.read();
        console.log(deviceReq.fields);
        
        const code = deviceReq.fields.code;
        const token = await Remarkable.registerNewDevice(code);
        context.response.body = token;
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

app.use(async (ctx, next) => {
    console.log("Before");
    try {
        await next();
        console.log(`${ctx.request.method} ${ctx.request.url} ${ctx.response.status}`);
    } catch(e) {
        console.log(`${ctx.request.method} ${ctx.request.url} ${ e }`);
    }
});
app.use(router.routes());
app.use(router.allowedMethods());


const listenPort = argPort ? Number(argPort) : DEFAULT_PORT;

console.log(`Listening to port: ${listenPort}`);

await app.listen({ port: listenPort });
