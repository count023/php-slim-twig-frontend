<?php
// Routes

$app->get('/', App\Actions\HomeAction::class)
    ->setName('homepage');

$app->get('/{path:[a-zA-Z0-9\-]+}/', App\Actions\SectionAction::class)
    ->setName('sectionpage');

$app->get('/{path:[a-zA-Z0-9\-]+}/article{articleId:[0-9]+}/[{urlArticleTitle:[a-zA-Z0-9\-]+}.html]', App\Actions\ArticleAction::class)
    ->setName('articlepage');
