<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 03:28
 */

namespace App\Domain;

use Aura\Payload\Payload as AuraPayload;
use Slim\Http\Request;


class Payload extends AuraPayload {

    const INPUT_KEY_REQUEST = 'request';
    const INPUT_KEY_REQUEST_PATH_INFO = 'requestPathInfo';

    /**
     * Payload constructor.
     * @param Request $request
     * @param array $requestPathInfo
     */
    public function __construct(Request $request, array $requestPathInfo) {
        $this->setInput([
            self::INPUT_KEY_REQUEST => $request,
            self::INPUT_KEY_REQUEST_PATH_INFO => $requestPathInfo
        ]);
        $this->setStatus(PayloadStatus::OK);
    }

    public function getRequest(): Request {
        return $this->getInput()[self::INPUT_KEY_REQUEST];
    }

    /**
     * See Routing (routes.php). Keys:
     *  - path => {@link REQUEST_PATH_INFO_BASEPATH}
     *  - articleId => {@link REQUEST_PATH_INFO_ARTICLE_ID}
     *  - urlArticleTitle => {@link REQUEST_PATH_INFO_URL_ARTICLE_TITLE}
     *
     * @return array
     */
    public function getRequestPathInfo(): array {
        return $this->getInput()[self::INPUT_KEY_REQUEST_PATH_INFO];
    }
}