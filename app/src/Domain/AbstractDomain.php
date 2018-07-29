<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 00:34
 */

namespace App\Domain;


use Psr\Log\LoggerInterface;

abstract class AbstractDomain implements DomainInterface {

    /**
     * @var LoggerInterface
     */
    protected $logger;

    /**
     * Article constructor.
     * @param LoggerInterface $logger
     */
    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

}