<?php

namespace App\Responders;


use Slim\Http\Response;
use Slim\Views\Twig;

class ArticleResponder extends AbstractResponder {

    /**
     * ArticleResponder constructor.
     * @param Twig $twig
     * @param string $htmlTemplateFile
     */
    public function __construct(Twig $twig, string $htmlTemplateFile) {
        parent::__construct($twig, $htmlTemplateFile);
    }

    /**
     * @param Response $response
     * @param array $data
     * @return mixed
     */
    public function renderHtml(Response $response, $data = []) {
        return $this->view->render($response, $this->htmlTemplateFile, $data);
    }
}
