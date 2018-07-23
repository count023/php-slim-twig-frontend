<?php
/**
 * Created by PhpStorm.
 * User: Glenn
 * Date: 2015-09-11
 * Time: 1:32 PM
 */

namespace Blog\Responder;


use Slim\Http\Response;
use Slim\Views\Twig;

class SectionResponder extends AbstractResponder {

    /**
     * @param \Slim\Views\Twig $twig
     */
    public function __construct(Twig $twig, string $htmlTemplateFile = 'section.twig') {
        parent::__construct($twig, $htmlTemplateFile);
    }

    /**
     * @param \Slim\Http\Response $response
     * @param array               $data
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function renderHtml(Response $response, $data = []) {
        return $this->view->render($response, $this->htmlTemplateFile, $data);
    }
}
