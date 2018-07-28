<?php

namespace App\Responders;


use Slim\Views\Twig;

class ResponderFactory {

    /**
     * @var \Slim\Views\Twig
     */
    protected $twig;

    /**
     * ResponderFactory constructor.
     *
     * @param \Slim\Views\Twig $twig
     */
    public function __construct(Twig $twig) {
        $this->twig = $twig;
    }

    /**
     * @return SectionResponder
     */
    public function getHomeResponder() {
        return new SectionResponder($this->twig, 'home.twig');
    }

    /**
     * @return SectionResponder
     */
    public function getSectionResponder() {
        return new SectionResponder($this->twig, 'section.twig');
    }

    /**
     * @return ArticleResponder
     */
    public function getArticleResponder() {
        return new ArticleResponder($this->twig, 'article.twig');
    }

}
