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
     */
    protected $id;
    /**
     * from key 'contentType'
     * @var string
     */
    protected $type;
    /**
     * @var int
     */
    protected $creationDate;
    /**
     * @var int
     */
    protected $activateDate;
    /**
     * @var int
     */
    protected $firstPublishedDate;
    /**
     * @var int
     */
    protected $lastModified;
    /**
     * @var int
     */
    protected $expireDate;
    /**
     * @var string
     */
    protected $source;
    /**
     * @var string
     */
    protected $sourceId;
    /**
     * @var string
     */
    protected $title;
    /**
     * TODO: State-Enum?
     * @var string
     */
    protected $state;
    /**
     * @var boolean
     */
    protected $isLive;
    /**
     * @var integer
     */
    protected $ownerPublicationId;

    /**
     * @var string
     */
    protected $url;

    /**
     * @var Section
     */
    protected $homeSection;

    /**
     * @var array<string, string>
     */
    protected $fields;

    /**
     * @var Author[]
     */
    protected $authors;

    /**
     * @var string[]
     */
    protected $tags;

    /**
     * @var array<string,ArticleRelation[]>
     */
    protected $relations;

    /**
     * @MarshallProperty(name="articleId", type="int")
     * @return int
     */
    public function getId(): int {
        return $this->id;
    }
    /**
     * @param int $id
     * @MarshallProperty(name="articleId", type="int")
     */
    public function setId(int $id) {
        $this->id = $id;
    }

    /**
     * @MarshallProperty(name="contentType", type="string")
     * @return string
     */
    public function getType(): string {
        return $this->type;
    }
    /**
     * @param string $type
     * @MarshallProperty(name="contentType", type="string")
     */
    public function setType(string $type) {
        $this->type = $type;
    }

    /**
     * @MarshallProperty(name="creationDate", type="int")
     * @return int|null
     */
    public function getCreationDate(): int {
        return $this->creationDate;
    }
    /**
     * @return \DateTime
     */
    public function getCreationDateAsDate(): \DateTime {
        return $this->getAsDateTimeOrNull($this->creationDate);
    }
    /**
     * @MarshallProperty(name="creationDate", type="int")
     * @param int $creationDate|null
     */
    public function setCreationDate($creationDate) {
        $this->creationDate = $creationDate;
    }

    /**
     * @MarshallProperty(name="activateDate", type="int")
     * @return int|null
     */
    public function getActivateDate(): int {
        return $this->activateDate;
    }
    /**
     * @return \DateTime
     */
    public function getActivateDateAsDate(): \DateTime {
        return $this->getAsDateTimeOrNull($this->activateDate);
    }
    /**
     * @param int $activateDate|null
     * @MarshallProperty(name="activateDate", type="int")
     */
    public function setActivateDate($activateDate) {
        $this->activateDate = $activateDate;
    }

    /**
     * @MarshallProperty(name="firstPublishedDate", type="int")
     * @return int|null
     */
    public function getFirstPublishedDate(): int {
        return $this->firstPublishedDate;
    }
    /**
     * @return \DateTime
     */
    public function getFirstPublishedDateAsDate(): \DateTime {
        return $this->getAsDateTimeOrNull($this->firstPublishedDate);
    }
    /**
     * @param int $firstPublishedDate|null
     * @MarshallProperty(name="firstPublishedDate", type="int")
     */
    public function setFirstPublishedDate($firstPublishedDate) {
        $this->firstPublishedDate = $firstPublishedDate;
    }

    /**
     * @MarshallProperty(name="lastModified", type="int")
     * @return int|null
     */
    public function getLastModified(): int {
        return $this->lastModified;
    }
    /**
     * @return \DateTime
     */
    public function getLastModifiedAsDate(): \DateTime {
        return $this->getAsDateTimeOrNull($this->lastModified);
    }
    /**
     * @MarshallProperty(name="lastModified", type="int")
     * @param int $lastModified|null
     */
    public function setLastModified($lastModified) {
        $this->lastModified = $lastModified;
    }

    /**
     * @MarshallProperty(name="expireDate", type="int")
     * @return int|null
     */
    public function getExpireDate(): int {
        return $this->expireDate;
    }
    /**
     * @return \DateTime
     */
    public function getExpireDateAsDate(): \DateTime {
        return $this->getAsDateTimeOrNull($this->expireDate);
    }
    /**
     * @param int $expireDate|null
     * @MarshallProperty(name="expireDate", type="int")
     */
    public function setExpireDate($expireDate) {
        $this->expireDate = $expireDate;
    }

    /**
     * @MarshallProperty(name="source", type="string")
     * @return string
     */
    public function getSource() {
        return $this->source;
    }
    /**
     * @param string $source
     * @MarshallProperty(name="source", type="string")
     */
    public function setSource($source) {
        $this->source = $source;
    }

    /**
     * @MarshallProperty(name="sourceId", type="string")
     * @return string
     */
    public function getSourceId(): string {
        return $this->sourceId;
    }
    /**
     * @param string $sourceId
     * @MarshallProperty(name="sourceId", type="string")
     */
    public function setSourceId(string $sourceId) {
        $this->sourceId = $sourceId;
    }

    /**
     * @MarshallProperty(name="title", type="string")
     * @return string
     */
    public function getTitle(): string {
        return $this->title;
    }
    /**
     * @param string $title
     * @MarshallProperty(name="title", type="string")
     */
    public function setTitle(string $title) {
        $this->title = $title;
    }

    /**
     * @MarshallProperty(name="state", type="string")
     * @return string
     */
    public function getState(): string {
        return $this->state;
    }
    /**
     * @param string $state
     * @MarshallProperty(name="state", type="string")
     */
    public function setState(string $state) {
        $this->state = $state;
    }

    /**
     * @MarshallProperty(name="isLive", type="bool")
     * @return boolean
     */
    public function isIsLive(): bool {
        return $this->isLive;
    }
    /**
     * @param boolean $isLive
     * @MarshallProperty(name="isLive", type="bool")
     */
    public function setIsLive(bool $isLive) {
        $this->isLive = $isLive;
    }

    /**
     * @MarshallProperty(name="ownerPublicationId", type="int")
     * @return int
     */
    public function getOwnerPublicationId(): int {
        return $this->ownerPublicationId;
    }
    /**
     * @param int $ownerPublicationId
     * @MarshallProperty(name="ownerPublicationId", type="int")
     */
    public function setOwnerPublicationId(int $ownerPublicationId) {
        $this->$ownerPublicationId = $ownerPublicationId;
    }

    /**
     * @MarshallProperty(name="articleUrl", type="string")
     * @return string
     */
    public function getUrl(): string {
        return $this->url;
    }
    /**
     * @param string $url
     * @MarshallProperty(name="articleUrl", type="string")
     */
    public function setUrl(string $url) {
        $this->url = $url;
    }

    /**
     * @MarshallProperty(name="homeSection", type="App\Domain\Repositories\Model")
     * @return Section
     */
    public function getHomeSection(): Section {
        return $this->homeSection;
    }
    /**
     * @param Section $homeSection
     * @MarshallProperty(name="homeSection", type="App\Domain\Repositories\Model")
     */
    public function setHomeSection(Section $homeSection) {
        $this->homeSection = $homeSection;
    }

    /**
     * @MarshallProperty(name="fields", type="array")
     * @return array
     */
    public function getFields(): array {
        return $this->fields;
    }
    /**
     * @param array $fields
     * @MarshallProperty(name="fields", type="array")
     */
    public function setFields(array $fields) {
        $this->fields = $fields;
    }

    /**
     * @MarshallProperty(name="authors", type="App\Domain\Repositories\Author[]")
     * @return Author[]
     */
    public function getAuthors(): array {
        return $this->authors;
    }
    /**
     * @param Author[] $authors
     * @MarshallProperty(name="authors", type="App\Domain\Repositories\Author[]")
     */
    public function setAuthors(array $authors) {
        $this->authors = $authors;
    }

    /**
     * @MarshallProperty(name="tags", type="string[]")
     * @return \string[]
     */
    public function getTags(): array {
        return $this->tags;
    }
    /**
     * @param \string[] $tags
     * @MarshallProperty(name="tags", type="string[]")
     */
    public function setTags(array $tags) {
        $this->tags = $tags;
    }

    /**
     * @MarshallProperty(name="relations", type="array")
     * @return array
     */
    public function getRelations(): array {
        return $this->relations;
    }
    /**
     * @param array $relations
     * @MarshallProperty(name="relations", type="array")
     */
    public function setRelations(array $relations) {
        $this->relations = $relations;
    }

    private function getAsDateTimeOrNull($timestamp): \DateTime {
        if ($timestamp != null) {
            $dateTime = new \DateTime();
            return $dateTime->setTimestamp($timestamp);
        }
        return$timestamp;
    }

}