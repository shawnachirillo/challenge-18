import express from 'express';
console.log('🟢 Minimal server.ts is running');
const app = express();
const PORT = 3002;
app.get('/', (_req, res) => {
    res.send('✅ Hello Shawna!');
});
app.listen(PORT, () => {
    console.log(`✅ Listening at http://localhost:${PORT}`);
});
