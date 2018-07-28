<?php
// Routes

$app->get('/', App\Actions\Home::class)
    ->setName('homepage');

$app->get('/{path:[a-zA-Z0-9\-]+}/', App\Actions\Section::class)
    ->setName('sectionpage');

$app->get('/{path:[a-zA-Z0-9\-]+}/article{articleId:[0-9]+}/[{urlArticleTitle:[a-zA-Z0-9\-]+}.html]', App\Actions\Article::class)
    ->setName('articlepage');
