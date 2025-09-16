import express  from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const execPromise = promisify(exec);

const app = express();
const PORT = 8080; // Change to your preferred port

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(process.env.HOME || '', '.mozilla/firefox/firefox-mpris');
const targetDir = path.join(__dirname, 'static');
const targetFile = path.join(targetDir, 'cover.png');

// Copy latest cover
function copyLatestCover() {
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.png'));
  if (!files.length) return;

  const latest = files
    .map(file => ({
      file,
      mtime: fs.statSync(path.join(sourceDir, file)).mtime.getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime)[0].file;

  fs.copyFileSync(path.join(sourceDir, latest), targetFile);
}

app.get('/api/status', async (req,res) => {
    copyLatestCover();

    const { stdout: title } = await execPromise('playerctl metadata title');
    const { stdout: artist } = await execPromise('playerctl metadata artist');

    res.json({ 
        title: title.trim(),
        artist: artist.trim(),                
    });
})

app.use(express.static(__dirname));

app.post("/play", (req, res) => {
    exec('playerctl play');
    res.json({ success: true });
});

app.post("/pause", (req, res) => {
    exec('playerctl pause');
    res.json({ success: true });
});

app.post("/next", (req, res) => {
    exec('playerctl next');
    res.json({ success: true });
});

app.post("/prev", (req, res) => {
    exec('playerctl previous');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
