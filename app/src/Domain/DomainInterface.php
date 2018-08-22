<?php
/**
 * Created by count023 for php-slim-twig-frontend
 * Date: 29.07.2018
 * Time: 00:10
 */

namespace App\Domain;


interface DomainInterface {

    /**
     * @param $payload Payload having in input the $request and the arguments passed by the request
     * @return Payload enriched data to be passed to the Responder for the template
     */
    public function fetchData(Payload $payload): Payload;

}