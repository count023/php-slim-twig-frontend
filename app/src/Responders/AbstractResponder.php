<?php
/**
 * Created by PhpStorm.
 * User: Glenn
 * Date: 2015-09-02
 * Time: 1:57 PM
 */

namespace App\Responders;
use Slim\Http\Response;
use Slim\Views\Twig;

/**
 * Class Responder
 *
 * @package Blog\Responder
 */
abstract class AbstractResponder {
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
