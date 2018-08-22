<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 21:00
 */

namespace App\Domain\Repositories\Model;

/**
 * Class ArticleRelation
 * @package App\Domain\Repositories\Model
 *
 * JSON from content-api:
 * <code>
 * {
 *     "internalUri": "internal:/article/214924319",
 *     "contentType": "image",
 *     "fields": {
 *         "Copyright/copyright": "knowyourmeme.com",
 *         "Bildunterschrift/caption": "c"
 *     }
 * }
 * </code>
 */
class ArticleRelation {

    /**
     * @var string
     * @MarshallProperty(name="internalUri", type="string")
     */
    public $internalUri;
    /**
     * @var string
     * @MarshallProperty(name="contentType", type="string")
     */
    public $contentType;
    /**
     * @var array<string, string>
     * @MarshallProperty(name="fields", type="array")
     */
    public $fields;
}