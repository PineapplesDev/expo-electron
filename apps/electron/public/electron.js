// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const url = require('url')

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Prevent having error
  event.preventDefault()
  // and continue
  callback(true)
})

// const urlFrom = urlObject => String(Object.assign(new URL(urlObject.pathname), urlObject))

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? `file://${path.resolve(path.join(__dirname, '../build/index.html'))}`
    : 'http://localhost:8081'
  // urlFrom({
  //     pathname: path.join(__dirname, 'index.html'),
  //     protocol: 'file:',
  //     slashes: true
  //   })
  // 'https://localhost:19006' // :'http://localhost:3000'

  console.log('[electron.js] __dirname', __dirname)
  console.log('[electron.js] appURL', appURL)
  console.log('[electron.js] app.getAppPath()', app.getAppPath())
  console.log('[electron.js] process.env', process.env)
  
  // function isDev() {
  //   return process.mainModule.filename.indexOf('app.asar') === -1;
  // }

  // if (app.isPackaged) {
  // if (!isDev()) {
  //   // mainWindow.loadURL(`file://${process.cwd()}/build/index.html`);
  //   // mainWindow.loadURL(`file://index.html`)
  //   mainWindow.loadFile('build/index.html')
  // } else {
  //   mainWindow.loadURL(appURL)
  // }
  try {
    mainWindow.loadFile('build/index.html')
  } catch (error) {
    mainWindow.loadURL(appURL)
  }

  // Automatically open Chrome's DevTools in development mode.
  // if (!app.isPackaged) {
  mainWindow.webContents.openDevTools()
  // }

  mainWindow.once('ready-to-show', () => {
    protocol.interceptFileProtocol(
      'file',
      (request, callback) => {
        const filePath = request.url.replace('file://', '')
        const url = request.url.includes('static/media/')
          ? path.normalize(`${__dirname}/${filePath}`)
          : filePath

        callback({ path: url })
      },
      err => {
        if (err) console.error('Failed to register protocol')
      }
    )
  })
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(8)
      callback({ path: path.normalize(`${__dirname}/${url}`) })
    },
    error => {
      if (error) console.error('Failed to register protocol')
    }
  )
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  setupLocalFilesNormalizerProxy()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = 'https://pineapples.dev'
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault()
    }
  })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
