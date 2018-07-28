<?php
// Routes

$app->get('/', App\Actions\Home::class)
    ->setName('homepage');
