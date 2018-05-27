# Angular1-Blueimp-Wistia

AngularJs 1 client for uploading videos to Wistia service. A `component-based` pattern based on [AngularJS-Boilerplate](https://github.com/jbutko/AngularJS-Boilerplate)

## 1. Setup
```bash
npm install
```

## 2. Watch files
```bash
gulp
```
- all SCSS/HTML/JS will be watched for changes and lint errors with browser reloading

## 3. Build production version
```bash
gulp build
```
- build task includes:
* clean _build folder
* compile and minify SASS files
* copy and optimize images
* minify and copy all HTML files into $templateCache
* build index.html with useming package
* copy assets

## 4. Start webserver without watch task
```bash
gulp server
```

## 5. Start webserver from build folder
```bash
gulp server-build
```
