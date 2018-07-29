<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 2018-07-21
 * Time: 1:57 PM
 */

namespace App\Responders;

use Slim\Views\Twig;

/**
 * Class AbstractResponder
 *
 * @package App\Responders
 */
abstract class AbstractResponder implements ResponderInterface {

    /**
     * @var \Slim\Views\Twig
     */
    protected $view;

    /**
     * @var string
     */
    protected $htmlTemplateFile;

    /**
     * @param \Slim\Views\Twig $twig
     * @param string
     */
    public function __construct(Twig $twig, string $htmlTemplateFile) {
        $this->view = $twig;
        $this->htmlTemplateFile = $htmlTemplateFile;
    }

}
