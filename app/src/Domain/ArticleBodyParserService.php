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

        //$this->logger->debug('BEFORE clearHtml: articleBody: {ab}', ['ab' => $articleBody]);
        $articleBody = $this->clearHtml($articleBody);
        //$this->logger->debug('AFTER clearHtml: articleBody: {ab}', ['ab' => $articleBody]);

        // separate the paragraphs:
        $domDocument = new \DOMDocument();
        $domDocument->loadHTML('<?xml encoding="utf-8" ?>' . $articleBody);
        $domDocument->normalizeDocument();
        if ($domDocument !== false) {
            $paragraphs = $domDocument->getElementsByTagName('p');
            foreach ($paragraphs as $paragraph) {
                $this->logger->debug('paragraph: ', ['p' => $paragraph->C14N()]);
            }
        }
        $xpath = new \DOMXPath($domDocument);
        // returns a list of all links with rel=nofollow
        $nlist = $xpath->query("//a[starts-with(@href, 'internal:')]");
        foreach ($nlist as $anchor) {
            $this->logger->debug('anchor with internal: link: ', ['a' => $anchor->C14N()]);
        }

        return $articleBody;
    }

    /**
     * @param string $articleBody
     * @return string
     */
    protected function clearHtml(string $articleBody): string {
        $articleBody = $this->removeScaytRubbish($articleBody);
        $articleBody = $this->replaceFqdnsByDocRootRelativeSlash($articleBody);
        $articleBody = $this->correctHeadlineHierarchie($articleBody);
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

    protected function correctHeadlineHierarchie($articleBody): string {
        $articleBody = preg_replace('/<h6([^>]*)>(.*?)<\/h6>/', "<p$1 data-hl=\"headline-level-7\"><strong>$2</strong></p>", $articleBody);
        $articleBody = preg_replace('/<h5([^>]*)>(.*?)<\/h5>/', "<h6$1>$2</h6>", $articleBody);
        $articleBody = preg_replace('/<h4([^>]*)>(.*?)<\/h4>/', "<h5$1>$2</h5>", $articleBody);
        $articleBody = preg_replace('/<h3([^>]*)>(.*?)<\/h3>/', "<h4$1>$2</h4>", $articleBody);
        $articleBody = preg_replace('/<h2([^>]*)>(.*?)<\/h2>/', "<h3$1>$2</h3>", $articleBody);
        $articleBody = preg_replace('/<h1([^>]*)>(.*?)<\/h1>/', "<h3$1>$2</h3>", $articleBody);
        return $articleBody;
    }

}