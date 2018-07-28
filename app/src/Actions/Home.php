<?php
namespace App\Actions;

use App\Responders\ResponderFactory;
use App\Responders\SectionResponder;
use Psr\Log\LoggerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

final class Home {

    /**
     * @var SectionResponder
     */
    private $responder;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * Home constructor.
     * @param ResponderFactory $responderFactory
     * @param LoggerInterface $logger
     */
    public function __construct(ResponderFactory $responderFactory, LoggerInterface $logger) {
        $this->responder = $responderFactory->getHomeResponder();
        $this->logger = $logger;
    }

    public function __invoke(Request $request, Response $response, $args){

        $this->logger->info("Home page action dispatched");

        $this->responder->renderHtml($response, $args);

        return $response;
    }
}
