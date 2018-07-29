<?php

// To help the built-in PHP dev server, check if the request was actually for
// something which should probably be served as a static file

# fix for dot-uris with php-builtin server (1):
#   https://stackoverflow.com/questions/46568528/php-built-in-server-shows-index-page-instead-of-static-file
if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    #echo "url[path]: '" . $url['path'] . "'\n\n";
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
    # fix for dot-uris with php-builtin server (2):
    #   https://github.com/slimphp/Slim/issues/1829#issuecomment-220913048
    if ($_SERVER['SCRIPT_FILENAME'] !== __FILE__) {
        $_SERVER['SCRIPT_NAME'] = __FILE__;
    }
}

require __DIR__ . '/../vendor/autoload.php';

// Instantiate the app
$settings = require __DIR__ . '/../app/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../app/dependencies.php';

// Register middleware
require __DIR__ . '/../app/middleware.php';

// Register routes
require __DIR__ . '/../app/routes.php';

// Run!
$app->run();

