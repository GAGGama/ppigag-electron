const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path=require('path');
const main = require('electron-reload');

if(process.env.NODE_ENV!=='production'){
    require('electron-reload')(__dirname,{
        electron:path.join(__dirname,'../node_modules','bin','electron')
    });
}

let mainWindow;
let newProductWindow;

app.on('ready',()=>{
    //mainWindow=new BrowserWindow({});
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'views/index.html'),
        protocol:'file',
        slashes:true
    }));

    const mainMenu=Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed',()=>{
        app.quit();
    });
});

function createNewProductWindow(){
    /*newProductWindow=new BrowserWindow({
        width:400,
        height:300,
        title:'Agregar Nuevo Producto'
    });*/
    newProductWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false
        }
    });
    //newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
        pathname:path.join(__dirname,'views/new-product.html'),
        protocol:'file',
        slashes:true
    }));

    newProductWindow.on('closed',()=>{
        newProductWindow=null;
    });

}

ipcMain.on('product:new', (e, newProduct)=>{
    //console.log(newProduct);
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
});

const templateMenu=[
    {
        label:'File',
        submenu:[
            {
                label:'Nuevo Producto',
                accelerator:'Ctrl+N',
                click(){
                    createNewProductWindow();
                }
            },
            {
                label:'Eliminar Productos',
                click(){
                    mainWindow.webContents.send('products:remove-all');
                }
            },
            {
                label:'Salir',
                accelerator:'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

if(process.env.NODE_ENV!=='production'){
    templateMenu.push({
        label:'Herramientas Desarrollo',
        submenu:[
            {
                label:'Muestra/Oculta Herramientas Desarrollo',
                accelerator:'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    });
}



