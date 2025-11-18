    // src/index.ts
    import express from 'express';

    const app = express();
    const port = process.env['port]'] || 3000;

    app.get('/', (req, res) => {
      console.debug(`enter get with req ${req}`)
      res.send('Hello from TypeScript API!');
    });

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
