<?php
// Routes

define('REQUEST_PATH_INFO_BASEPATH', 'path');
define('REQUEST_PATH_INFO_ARTICLE_ID', 'articleId');
define('REQUEST_PATH_INFO_URL_ARTICLE_TITLE', 'urlArticleTitle');

$app->get('/', App\Actions\HomeAction::class)
    ->setName('homepage');

$app->get('/{' . REQUEST_PATH_INFO_BASEPATH . ':[a-zA-Z0-9\-]+}/', App\Actions\SectionAction::class)
    ->setName('sectionpage');

$app->get('/{' . REQUEST_PATH_INFO_BASEPATH . ':[a-zA-Z0-9\-]+}/article{' . REQUEST_PATH_INFO_ARTICLE_ID . ':[0-9]+}/[{' . REQUEST_PATH_INFO_URL_ARTICLE_TITLE . ':[a-zA-Z0-9\-]+}.html]', App\Actions\ArticleAction::class)
    ->setName('articlepage');
