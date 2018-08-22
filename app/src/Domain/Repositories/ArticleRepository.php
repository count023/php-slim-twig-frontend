<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 21:52
 */

namespace App\Domain\Repositories;


use App\Domain\Repositories\Model\Article;
use PhpJsonMarshaller\Decoder\ClassDecoder;
use PhpJsonMarshaller\Exception\JsonDecodeException;
use PhpJsonMarshaller\Exception\UnknownPropertyException;
use PhpJsonMarshaller\Marshaller\JsonMarshaller;
use PhpJsonMarshaller\Reader\DoctrineAnnotationReader;
use Psr\Log\LoggerInterface;

class ArticleRepository {

    const REQUEST_OPTIONS = [
        'http' => [
            'method' => 'GET',
            'header' => "Accept-language: de\r\n"
        ]
    ];
    private static $STREAM_CONTEXT = null;

    /**
     * @var string
     */
    private $apiBaseUri;

    /**
     * @var \PhpJsonMarshaller\Marshaller\JsonMarshaller
     */
    private $marshaller;

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

        $this->marshaller = new JsonMarshaller(new ClassDecoder(new DoctrineAnnotationReader()));
    }

    /**
     * retrieve article data from Content-API
     *
     * @param int $articleId
     * @return Article
     * @throws JsonDecodeException
     * @throws UnknownPropertyException
     */
    public function fetchArticle(int $articleId): Article {

        $article = null;
        $articleRawData = null;

        try {
            $articleRawData = $this->requestRawData($articleId);
        } catch (\Exception $e) {
            $this->logger->error('retrieving data from content-api fails with exception: {msg}', ['msg' => $e->getMessage()]);
        }
        if ($articleRawData !== null) {
            $article = $this->marshaller->unmarshall($articleRawData, '\App\Domain\Repositories\Model\Article');
        }

        return $article;
    }

    /**
     * TODO: handle 404 and other errors
     *  - TODO: http://php.net/manual/de/function.file-get-contents.php
     * TODO: What, if deleted is reported by a 410 but a 404 by content-api?
     *
     * @param int $articleId
     * @return string
     */
    protected function requestRawData(int $articleId): string {

        $start = microtime(true);

        $articleRawData = file_get_contents($this->apiBaseUri . $articleId, false, self::$STREAM_CONTEXT);

        $requestToContentApiDuration = round((microtime(true) - $start) * 1000, 2);
        $this->logger->debug('ArticleData retrieved in {ms}ms', ['ms' => '' . $requestToContentApiDuration]);

        return $articleRawData;
    }

}
