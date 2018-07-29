<?php
// DIC configuration

$container = $app->getContainer();

// -----------------------------------------------------------------------------
// Service providers
// -----------------------------------------------------------------------------

// Twig
/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \Slim\Views\Twig
 */
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
$container['flash'] = function () {
    return new Slim\Flash\Messages;
};

// -----------------------------------------------------------------------------
// Service factories
// -----------------------------------------------------------------------------

// monolog
/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \Monolog\Logger
 */
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

/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Responders\ResponderFactory
 */
$container[App\Responders\ResponderFactory::class] = function ($c) {
    return new App\Responders\ResponderFactory($c['view']);
};


/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Domain\Home
 */
$container[App\Domain\Home::class] = function ($c) {
    return new App\Domain\Home($c->get('logger'));
};
/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Actions\Home
 */
$container[App\Actions\Home::class] = function ($c) {
    return new App\Actions\Home($c[App\Responders\ResponderFactory::class], $c[App\Domain\Home::class], $c->get('logger'));
};


/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Domain\Section
 */
$container[App\Domain\Section::class] = function ($c) {
    return new App\Domain\Section($c->get('logger'));
};
/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Actions\Section
 */
$container[App\Actions\Section::class] = function ($c) {
    return new App\Actions\Section($c[App\Responders\ResponderFactory::class], $c[App\Domain\Section::class], $c->get('logger'));
};


/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Domain\Article
 */
$container[App\Domain\Article::class] = function ($c) {
    return new App\Domain\Article($c->get('logger'));
};
/**
 * @param \Psr\Container\ContainerInterface $c
 * @return \App\Actions\Article
 */
$container[App\Actions\Article::class] = function ($c) {
    return new App\Actions\Article($c[App\Responders\ResponderFactory::class], $c[App\Domain\Article::class], $c->get('logger'));
};
