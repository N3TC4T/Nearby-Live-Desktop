![wnmlive-d](https://cloud.githubusercontent.com/assets/6250203/9152547/d32247a4-3e1c-11e5-8199-4c203c322c04.jpg)

# Nearby Live Desktop
Use Nearby Live on your OS X or Linux desktop.

**This is a unoffical app !**

__built with :__

- Angular  
- Electron 
- Photon
- Semantic UI
- ....

# Install Dependencies:

Global dependencies:
```
npm install -g gulp
```
Local dependencies:
```
npm install
```


# Pre-Requisites

OS x releases

For OS X releases, you need an OS X machine.

Linux releases

If you want to build deb and rpm packages for Linux, you need fpm. To quickly install it on OS X:
https://github.com/jordansissel/fpm#system-packages

```
sudo gem install fpm
brew install rpm
```

Windows releases

For Windows releases, you need a Windows machine. The packaging tasks only work on Windows due to their dependencies: Squirrel.Windows and Microsoft's SignTool.
To sign the app, make sure you have SignTool.exe in your PATH.


# Code Signing

Sign the installer

The pack:win32:installer task uses Squirrel.Windows to create the installer. Squirrel will also sign the app and the installer itself. You just need these env vars:

```
SET SIGN_WIN_CERTIFICATE_FILE=C:\SuperKit\cert.pfx
SET SIGN_WIN_CERTIFICATE_PASSWORD=DaenerysTargaryen
```


Sign the portable app

The pack:win32:portable task just creates a zip with all the files in ./build/win32. But before that, it uses SignTool.exe to sign the app executable. Again, make sure you have the env vars listed above set.


OS X

set these env vars:
```
export SIGN_DARWIN_IDENTITY="anything "
export SIGN_DARWIN_KEYCHAIN_NAME="/Users/brian/Library/Keychains/CertificatesChain.keychain"
export SIGN_DARWIN_KEYCHAIN_PASSWORD="NaNnullUndefinedWhatever"
```



# Gulp Tasks

__important tasks__

**dev**: Used to run system as development , browserify files,  serve them in sync and open electron

**pack**: with this format pack:{target}{arch}:{format} -> pack:linux64:dev

__other tasks__

build:& 	Used to move assets and edit properties of some files, depending on the platform.

clean:build:& 	Clean the build folder (remove the default app that ships with Electron).

clean:dist:& 	Remove files in dist and make sure the directory exists.

build-prepare:& 	process and move your code into the build folder.

download:& Download the Electron framework. Cache the files, then unzip them and move them into the build folder.

kill:& 	Kill the app if already running. Depends on the platform it is ran on.

pack:& 	Create the installers/packages. These also handle app signing.

purge:{build,cache,dist} 	Abolish the chosen directory.

resources:{darwin,linux,win} 	Process the resources and move them to the build folder.\

many more ...

# ScreenShots

![1](https://cloud.githubusercontent.com/assets/6250203/20071932/c1f5b56a-a53b-11e6-8fcd-8e9ae2d78214.png)

![2](https://cloud.githubusercontent.com/assets/6250203/20071999/ef76da5a-a53b-11e6-9f5c-1edbb50b441b.png)

![3](https://cloud.githubusercontent.com/assets/6250203/20072083/51901a94-a53c-11e6-8b85-b09e215f2e0f.png)

