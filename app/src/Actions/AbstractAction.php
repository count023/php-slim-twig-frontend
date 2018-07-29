<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 28.07.2018
 * Time: 23:08
 */

namespace App\Actions;


use App\Domain\DomainInterface;
use App\Responders\ResponderFactory;
use App\Responders\ResponderInterface;
use Psr\Log\LoggerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

abstract class AbstractAction {

    /**
     * @var ResponderInterface
     */
    protected $responder;

    /**
     * @var DomainInterface
     */
    protected $domain;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * AbstractAction constructor.
     * @param ResponderFactory $responderFactory
     * @param DomainInterface $domain
     * @param LoggerInterface $logger
     */
    public function __construct(ResponderFactory $responderFactory, DomainInterface $domain, LoggerInterface $logger) {
        $this->logger = $logger;

        $this->logger->debug("className: " . $this->getClassName());
        $this->responder = $responderFactory->getResponderByClassName($this->getClassName());

        $this->domain = $domain;
    }

    /**
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function __invoke(Request $request, Response $response, array $args){

        $this->logger->info($this->getClassName() . " dispatched with args: \n" . var_export($args, true) . "\n\n");

        $this->responder->renderHtml($response, $this->domain->fetchData($args));

        return $response;
    }

    /**
     * @return string
     */
    protected function getClassName() {
        // passing instance is important to really get the instance class name instead of the name of this abstract class!
        return get_class($this);
    }
}