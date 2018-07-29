<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 28.07.2018
 * Time: 22:54
 */

namespace App\Domain;


class Article extends AbstractDomain {

    /**
     * @param array $args
     * @return mixed
     */
    public function getData(array $args) {

        $articleId = $args['articleId'];

        # retrieve article data from Content-API
        // TODO: handle 404 and other errors
        //  - TODO: http://php.net/manual/de/function.file-get-contents.php
        $articleData = json_decode(file_get_contents('http://18.194.207.3:8080/contents/' . $articleId), true);
        #$this->logger->debug("articleData: " . var_export($articleData, true) . "\n\n");

        // TODO: implement ArticleBodyParser
        //  - TODO: replace internal links in body
        $articleData['fields']['body'] = str_replace('https://www.futurezone.de/', '/', $articleData['fields']['body']);

        return ['article' => $articleData];
    }
}