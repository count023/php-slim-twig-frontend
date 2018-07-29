<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 30.07.2018
 * Time: 00:10
 */

namespace App\Domain;


use Psr\Log\LoggerInterface;

class ArticleBodyParserService {

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * ArticleBodyParserService constructor.
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }


    /**
     * - TODO: replace internal links in body with widget-like separately rendered partials
     *
     * @param string $articleBody
     * @return string
     */
    public function parse(string $articleBody): string {

        $this->logger->debug('BEFORE clearHtml: articleBody: {ab}', ['ab' => $articleBody]);
        $articleBody = $this->clearHtml($articleBody);
        $this->logger->debug('AFTER clearHtml: articleBody: {ab}', ['ab' => $articleBody]);

        return $articleBody;
    }

    /**
     * @param string $articleBody
     * @return string
     */
    protected function clearHtml(string $articleBody): string {
        $articleBody = $this->removeScaytRubbish($articleBody);
        $articleBody = $this->replaceFqdnsByDocRootRelativeSlash($articleBody);
        return $articleBody;
    }

    /**
     * removes weird '<span class="scayt-misspell-word">' created by scayt in CKEditor
     * @see https://github.com/WebSpellChecker/ckeditor-plugin-scayt/issues/104
     *
     * @param string $articleBody
     * @return string
     */
    protected function removeScaytRubbish(string $articleBody): string {
        $articleBody = preg_replace('/<span class="scayt-misspell-word">([^<>]*)<\/span>/', "$1", $articleBody);
        $articleBody = preg_replace('/<span class="scayt-misspell-word">([^<>]*)<\/span>/', "$1", $articleBody);
        return $articleBody;
    }

    protected function replaceFqdnsByDocRootRelativeSlash(string $articleBody): string {
        return preg_replace('/https?\:\/\/[^\/]*\//', '/', $articleBody);
    }
}