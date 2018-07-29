<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 00:10
 */

namespace App\Domain;


interface DomainInterface {

    /**
     * @param array $args
     * @return array
     */
    public function getData(array $args);

}