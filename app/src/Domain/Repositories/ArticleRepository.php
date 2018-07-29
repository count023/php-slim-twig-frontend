<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 21:52
 */

namespace App\Domain\Repositories;


use Psr\Log\LoggerInterface;

class ArticleRepository {

    const REQUEST_OPTIONS = [
          'http' => [
            'method' => 'GET',
            'header' => "Accept-language: de\r\n"
          ]
    ];

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * Article constructor.
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

    /**
     * @param int $articleId
     * @return array
     */
    public function fetchArticle(int $articleId): array {

        $articleData = null;
        $articleRawData = null;

        try {
            $articleRawData = $this->requestRawData($articleId);
        } catch (\Exception $e) {
            $this->logger->error("retrieving data from content-api fails with exception: {}", [$e->getMessage()]);
        }
        if ($articleRawData !== null) {
            $articleData = json_decode($articleRawData, true);
        }

        return $articleData;
    }

    protected function requestRawData(int $articleId): string {
        $start = microtime(true);
        $articleRawData = file_get_contents('http://18.194.207.3:8080/contents/' . $articleId, false, self::REQUEST_OPTIONS);
        $requestToContentApiDuration = round((microtime(true) - $start) * 1000, 2);
        $this->logger->debug("articleData retrieved in " . $requestToContentApiDuration . "ms\n\n");

        return $articleRawData;
    }

}