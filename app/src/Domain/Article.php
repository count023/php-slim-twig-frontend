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
     * Article constructor.
     */
    public function __construct(LoggerInterface $logger, ArticleRepository $repository) {
        parent::__construct($logger);
        $this->repository = $repository;
    }

    /**
     * @param array $args the arguments passed by the request
     * @return array of the data to be passed to the Responder for the template
     */
    public function fetchData(array $args): array {

        $articleData = $this->repository->fetchArticle($args['articleId']);

        // TODO: implement ArticleBodyParser
        //  - TODO: replace internal links in body
        $articleData['fields']['body'] = str_replace('https://www.futurezone.de/', '/', $articleData['fields']['body']);

        return ['article' => $articleData];
    }
}