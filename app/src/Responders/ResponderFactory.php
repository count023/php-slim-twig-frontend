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
    public function getResponderByActionClassName(string $className): ResponderInterface {
        $responder = null;
        switch ($className) {
            case 'App\Actions\HomeAction':
                $responder = $this->getHomeResponder();
                break;
            case 'App\Actions\SectionAction':
                $responder = $this->getSectionResponder();
                break;
            case 'App\Actions\ArticleAction':
                $responder = $this->getArticleResponder();
                break;
        }
        if ($responder === null) {
            throw new \RuntimeException("No responder found for given class name: '$className'");
        }
        return $responder;
    }

    /**
     * @return SectionResponder
     */
    protected function getHomeResponder(): SectionResponder {
        return new SectionResponder($this->twig, 'home.twig');
    }

    /**
     * @return SectionResponder
     */
    protected function getSectionResponder(): SectionResponder {
        return new SectionResponder($this->twig, 'section.twig');
    }

    /**
     * @return ArticleResponder
     */
    protected function getArticleResponder(): ArticleResponder {
        return new ArticleResponder($this->twig, 'article.twig');
    }

}
