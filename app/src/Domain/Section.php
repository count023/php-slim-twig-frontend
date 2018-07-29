<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 00:31
 */

namespace App\Domain;


class Section extends AbstractDomain {

    /**
     * @param array $args
     * @return array
     */
    public function fetchData(array $args) {
        // TODO: Implement getData() method.
        return ['section' => ['title' => 'Section-Title']];
    }
}