<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 28.07.2018
 * Time: 23:08
 */

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
     * @param string $className
     * @return ResponderInterface|null
     */
    public function getResponderByClassName(string $className) {
        $responder = null;
        switch ($className) {
            case 'App\Actions\Home':
                $responder = $this->getHomeResponder();
                break;
            case 'App\Actions\Section':
                $responder = $this->getSectionResponder();
                break;
            case 'App\Actions\Article':
                $responder = $this->getArticleResponder();
                break;
        }
        return $responder;
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
