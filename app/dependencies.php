<?php
// DIC configuration

$container = $app->getContainer();

// -----------------------------------------------------------------------------
// Service providers
// -----------------------------------------------------------------------------

// Twig
$container['view'] = function ($c) {
    $settings = $c->get('settings');
    $view = new Slim\Views\Twig($settings['view']['template_path'], $settings['view']['twig']);

    // Add extensions
    $view->addExtension(new Slim\Views\TwigExtension($c->get('router'), $c->get('request')->getUri()));
    $view->addExtension(new Twig_Extension_Debug());

    // Add globals
    $view->getEnvironment()->addGlobal('currentUrl', $c->get('request')->getUri());

    return $view;
};

// Flash messages
$container['flash'] = function ($c) {
    return new Slim\Flash\Messages;
};

// -----------------------------------------------------------------------------
// Service factories
// -----------------------------------------------------------------------------

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings');
    $logger = new Monolog\Logger($settings['logger']['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['logger']['path'], Monolog\Logger::DEBUG));
    return $logger;
};

// -----------------------------------------------------------------------------
// Action factories
// -----------------------------------------------------------------------------

$container[App\Responders\ResponderFactory::class] = function ($c) {
    return new App\Responders\ResponderFactory($c['view']);
};

$container[App\Actions\Home::class] = function ($c) {
    return new App\Actions\Home($c[App\Responders\ResponderFactory::class], $c->get('logger'));
};

$container[App\Actions\Section::class] = function ($c) {
    return new App\Actions\Section($c[App\Responders\ResponderFactory::class], $c->get('logger'));
};

$container[App\Actions\Article::class] = function ($c) {
    return new App\Actions\Article($c[App\Responders\ResponderFactory::class], $c->get('logger'));
};
