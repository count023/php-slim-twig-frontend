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
     * TODO: send redirect if request uri does not fit to the article data uri
     * TODO: use Payload object: https://github.com/auraphp/Aura.Payload
     *
     * @param array $args the arguments passed by the request
     * @return array of the data to be passed to the Responder for the template
     */
    public function fetchData(array $args): array {

        $articleData = $this->repository->fetchArticle($args['articleId']);

        $articleData['fields']['body'] = $this->bodyParser->parse($articleData['fields']['body']);

        return ['article' => $articleData];
    }
}