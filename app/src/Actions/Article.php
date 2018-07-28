<?php
namespace App\Actions;

use App\Responders\ResponderFactory;
use App\Responders\SectionResponder;
use Psr\Log\LoggerInterface;
use Slim\Http\Request;
use Slim\Http\Response;

final class Article {

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
        $this->responder = $responderFactory->getArticleResponder();
        $this->logger = $logger;
    }

    public function __invoke(Request $request, Response $response, $args){

        $this->logger->info("Article page action dispatched with args: \n" . var_export($args, true) . "\n\n");

        $this->responder->renderHtml($response, $args);

        return $response;
    }
}
