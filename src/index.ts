import express from "express"
import cors from "cors"
import simpleGit from "simple-git"
import { generate } from "./generateId"
import path from "path"
import { getAllFiles } from "./getAllFiles"
import { uploadFile } from "./aws"

const app = express()
app.use(cors())
app.use(express.json())

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl
    const id = generate()
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));
    // console.log(files); 
    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file)
    })

    res.json({ id })
})

app.listen(3000, () => console.log(`app is running on port : 3000`))