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
    private static $STREAM_CONTEXT = null;

    private $apiBaseUri;

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * Article constructor.
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger, array $settings) {
        $this->logger = $logger;
        self::$STREAM_CONTEXT = stream_context_create(self::REQUEST_OPTIONS);
        $this->apiBaseUri = $settings['api-base-url'];
    }

    /**
     * retrieve article data from Content-API
     * TODO: handle 404 and other errors
     *  - TODO: http://php.net/manual/de/function.file-get-contents.php
     *
     * @param int $articleId
     * @return array
     */
    public function fetchArticle(int $articleId): array {

        $articleData = null;
        $articleRawData = null;

        try {
            $articleRawData = $this->requestRawData($articleId);
        } catch (\Exception $e) {
            $this->logger->error('retrieving data from content-api fails with exception: {msg}', ['msg' => $e->getMessage()]);
        }
        if ($articleRawData !== null) {
            $articleData = json_decode($articleRawData, true);
        }

        return $articleData;
    }

    protected function requestRawData(int $articleId): string {

        $start = microtime(true);

        $articleRawData = file_get_contents($this->apiBaseUri . $articleId, false, self::$STREAM_CONTEXT);

        $requestToContentApiDuration = round((microtime(true) - $start) * 1000, 2);
        $this->logger->debug('ArticleData retrieved in {ms}ms', ['ms' => '' . $requestToContentApiDuration]);

        return $articleRawData;
    }

}
