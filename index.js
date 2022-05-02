const express = require('express');
const compression = require('compression');
const fs = require("fs");
const path = require("path");
var mammoth = require("mammoth");
const app = express();
const port = 3000
const pdf2html = require('pdf2html');

app.use(compression())
app.use('/pages', express.static(__dirname + '/pages'));
app.use(express.static(__dirname + '/pages'));
app.get('/', (req, res) => {
    res.status(522).json({
        message: "Server đã sập, vui lòng quay lại sau",
        status: 522
    })
})
app.get('/_repl', (req, res) => {
    res.status(522).json({
        message: "Server đã sập, vui lòng quay lại sau",
        status: 522
    })
})
app.get('/page', (req, res) => {
    res.setHeader('Content-Type', 'text/HTML')
    if (req.query.page) {
        try {
            if (req.query.page.endsWith(".pdf")) {
                res.status(525).send(`<head>
<style>
  .menubar{
    padding: 10px;
  }
  * {
      box-sizing: border-box;
  }
</style>
</head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${req.query.page}</title><body style="  display: flex;height: 100vh;margin: 0;flex-direction: column;"><div class="menubar"><button onclick="(function(){
                        history.back()
                    })()">back</button></div> <div style="height: 100vh;width: 100%;max-height: 100%;overflow-y: auto;background: rgb(235 235 235);"><iframe src="../pages/${req.query.page}" frameborder=0 width="100%" height="100%"></div></body>`)
            } else {
                mammoth.convertToHtml({
                        path: `pages/${req.query.page}.docx`
                    })
                    .then(function (result) {
                        var html = result.value; // The generated HTML
                        
                        res.status(525).send(`<head>
<style>
  .menubar{
    padding: 10px;
  }
  * {
      box-sizing: border-box;
  }
</style>
</head><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${req.query.page}</title><body style="  display: flex;height: 100vh;margin: 0;flex-direction: column;"><div class="menubar"><button onclick="(function(){
                        history.back()
                    })()">back</button></div> <div style="height: 100vh;width: 100%;max-height: 100%;overflow-y: auto;background: rgb(235 235 235); padding: 10px; padding-bottom: 290px;">${html}</div></body>`)
                        
                        
                    })
                    .catch(() => {
                        res.status(522).json({
                            message: "Server đã sập, vui lòng quay lại sau",
                            status: 522
                        })
                    })
                    .done();
            }
            
        } catch (err) {
            res.status(522).json({
                message: "Server đã sập, vui lòng quay lại sau",
                status: 522
            })
            console.log(err)
        }
    } else {
        fs.readdir("./pages", (err, files) => {
            if (err) console.log(err);
            else {
                res.status(525).send(`<meta name="viewport" content="width=device-width, initial-scale=1.0"><h1 style='font-family: sans-serif;'>Nhà Thổ Education</h1><br/>` + `<div class="main" style='
  display: flex;
  flex-wrap: wrap;
'>` + files.map(file => {
                    if (file.endsWith(".docx") || file.endsWith(".pdf")) {
                        const href = `/page?page=${file.split('.docx').join(" ")}`
                        return `<a style="
background: rgb(200, 200, 200);
font-family: sans-serif;
color: rgb(30, 30, 30);
padding: 10px;
margin: 10px;
text-decoration: none;
" href="${href}">${file}</a><br/>`
                    }
                }).join(" ") + "</div>")
            }
        })
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
