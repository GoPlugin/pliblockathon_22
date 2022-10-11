var http = require('http');
var formidable = require('formidable');
//var fs = require('fs');

const {create}=require("ipfs-http-client");
const fs = require("fs")

async function ipfsClient()
{

    const ipfs =await create(

        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https"

        }
    );
    return ipfs;
}

async function saveFile(da) {

    let ipfs = await ipfsClient();
    //console.log("IPFS connected "+da);
    let data = fs.readFileSync(da);
    //console.log(data);
    
    let options = {
        
        warpWithDirectory: false,
        progress: (prog) => console.log(`Saved :${prog}`)
    }
    try{
    let result = await ipfs.add(data, options);}
    catch(error){console.log("Data uploading error");}
    console.log(result["path"]);    
    
}



http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;
       saveFile(oldpath); 
      
      
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);