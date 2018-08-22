<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 20:34
 */

namespace App\Domain\Repositories\Model;

use PhpJsonMarshaller\Annotations\MarshallProperty;

class Article {

    /**
     * from key 'articleId'
     * @var integer
     * @MarshallProperty(name="articleId", type="int")
     */
    public $id;
    /**
     * from key 'contentType'
     * @var string
     * @MarshallProperty(name="contentType", type="string")
     */
    public $type;
    /**
     * @var \DateTime
     * @MarshallProperty(name="creationDate", type="\DateTime")
     */
    public $creationDate;
    /**
     * @var \DateTime
     * @MarshallProperty(name="activateDate", type="\DateTime")
     */
    public $activateDate;
    /**
     * @var \DateTime
     * @MarshallProperty(name="firstPublishedDate", type="\DateTime")
     */
    public $firstPublishedDate;
    /**
     * @var \DateTime
     * @MarshallProperty(name="lastModified", type="\DateTime")
     */
    public $lastModified;
    /**
     * @var \DateTime
     * @MarshallProperty(name="expireDate", type="\DateTime")
     */
    public $expireDate;
    /**
     * @var string
     * @MarshallProperty(name="source", type="string")
     */
    public $source;
    /**
     * @var string
     * @MarshallProperty(name="sourceId", type="string")
     */
    public $sourceId;
    /**
     * @var string
     * @MarshallProperty(name="title", type="string")
     */
    public $title;
    /**
     * TODO: State-Enum?
     * @var string
     * @MarshallProperty(name="state", type="string")
     */
    public $state;
    /**
     * @var boolean
     * @MarshallProperty(name="isLive", type="boolean")
     */
    public $isLive;
    /**
     * @var integer
     * @MarshallProperty(name="ownerPublicationId", type="int")
     */
    public $ownerPublicationId;

    /**
     * @var string
     * @MarshallProperty(name="articleUrl", type="string")
     */
    public $articleUrl;

    /**
     * @var Section
     * @MarshallProperty(name="homeSection", type="App\Domain\Repositories\Model")
     */
    public $homeSection;

    /**
     * @var array<string, string>
     * @MarshallProperty(name="fields", type="array")
     */
    public $fields;

    /**
     * @var Author[]
     * @MarshallProperty(name="authors", type="App\Domain\Repositories\Author[]")
     */
    public $authors;

    /**
     * @var string[]
     * @MarshallProperty(name="authors", type="string[]")
     */
    public $tags;

    /**
     * @var array<string,ArticleRelation[]>
     * @MarshallProperty(name="authors", type="array")
     */
    public $relations;

}