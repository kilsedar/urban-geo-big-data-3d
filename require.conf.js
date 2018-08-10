requirejs.config({
  "baseUrl": "./",
  "paths": {
    "jquery": "vendor/jquery-3.3.1.min",
    "bootstrap": "vendor/bootstrap-4.1.0-dist/js/bootstrap.bundle.min"
  }
});

requirejs(["js/main"]);
