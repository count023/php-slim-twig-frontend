<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 20:55
 */

namespace App\Domain\Repositories\Model;

/**
 * Class Author
 * @package App\Domain\Repositories\Model
 *
 * JSON from content-api:
 * <code>
 * {
 *     "userName": "username",
 *     "firstName": "firstname",
 *     "lastName": "lastname",
 *     "email": "email@publisher.tld"
 * }
 * </code>
 */
class Author {

    /**
     * @var string
     * @MarshallProperty(name="userName", type="string")
     */
    public $userName;
    /**
     * @var string
     * @MarshallProperty(name="firstName", type="string")
     */
    public $firstName;
    /**
     * @var string
     * @MarshallProperty(name="lastName", type="string")
     */
    public $lastName;
    /**
     * @var string
     * @MarshallProperty(name="email", type="string")
     */
    public $email;
}