<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 28.07.2018
 * Time: 23:08
 */

namespace App\Responders;

use Psr\Http\Message\ResponseInterface;
use Slim\Http\Response;

interface ResponderInterface {

    /**
     * @param Response $response
     * @param array $data
     * @return ResponseInterface
     */
    public function renderHtml(Response $response, array $data): ResponseInterface;

}