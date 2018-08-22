<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 28.07.2018
 * Time: 22:54
 */

namespace App\Domain;


use App\Domain\Repositories\ArticleRepository;
use Psr\Log\LoggerInterface;

class Article extends AbstractDomain {

    /**
     * @var ArticleRepository
     */
    private $repository;

    /**
     * @var ArticleBodyParserService
     */
    private $bodyParser;

    /**
     * Article constructor.
     * @param LoggerInterface $logger
     * @param ArticleRepository $repository
     */
    public function __construct(LoggerInterface $logger, ArticleRepository $repository) {
        parent::__construct($logger);
        $this->repository = $repository;

        $this->bodyParser = new ArticleBodyParserService($this->logger);
    }

    /**
     * TODO: marshalling the input data!
     *
     * @param $payload Payload the request and the arguments passed by the request
     * @return Payload of the data to be passed to the Responder for the template
     */
    public function fetchData(Payload $payload): Payload {

        $articleData = $this->repository->fetchArticle($payload->getRequestPathInfo()[REQUEST_PATH_INFO_ARTICLE_ID]);

        if ($articleData !== null) {
            $articleData['fields']['body'] = $this->bodyParser->parse($articleData['fields']['body']);
            $payload->setOutput(['article' => $articleData]);

            if ($payload->getRequest()->getUri() == $articleData['articleUri']) {
                $payload->setStatus(PayloadStatus::OK);
            } else {
                $payload->setStatus(PayloadStatus::MOVED_PERMANENTLY);
            }
        } else {
            $payload->setStatus(PayloadStatus::NOT_FOUND);
        }

        return $payload;
    }
}