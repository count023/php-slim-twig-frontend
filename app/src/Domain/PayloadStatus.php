<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 03:51
 */

namespace App\Domain;

/**
 * Class PayloadStatus
 * @package App\Domain
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
class PayloadStatus {

    const __default = self::OK;


    const CONTINUE                          = 100; // The server has received the request headers and the client should proceed to send the request body
    const SWITCHING_PROTOCOLS               = 101; // The requester has asked the server to switch protocols and the server has agreed to do so
    const PROCESSING                        = 102; // A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request (RFC 2518)
    const EARLY_HINTS                       = 103; // used to return some response headers before final http message (rfc 8297)


    const OK                                = 200; // Standard response for successful HTTP requests
    const CREATED                           = 201; // The request has been fulfilled, resulting in the creation of a new resource
    const ACCEPTED                          = 202; // The request has been accepted for processing, but the processing has not been completed
    const NON_AUTHORITATIVE_INFORMATION     = 203; // The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response (since HTTP/1.1)
    const NO_CONTENT                        = 204; // The server successfully processed the request and is not returning any content
    const RESET_CONTENT                     = 205; // returning no content. Unlike a 204 response, this response requires that the requester reset the document view
    const PARTIAL_CONTENT                   = 206; // The server is delivering only part of the resource (byte serving) due to a range header sent by the client (RFC 7233)
    const MULTI_STATUS                      = 207; // The message body that follows is by default an XML message and can contain a number of separate response codes (WebDAV; RFC 4918)
    const ALREADY_REPORTED                  = 208; // The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again. (WebDAV; RFC 5842)
    const IM_USED                           = 226; // the server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance (rfc 3229)


    const MULTIPLE_CHOICES                  = 300; // Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation)
    const MOVED_PERMANENTLY                 = 301; // This and all future requests should be directed to the given URI
    const FOUND                             = 302; // (Previously "Moved temporarily") Tells the client to look at (browse to) another url. 302 has been superseded by 303 and 307
    const SEE_OTHER                         = 303; // The response to the request can be found under another URI using the GET method (since HTTP/1.1)
    const NOT_MODIFIED                      = 304; // Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match (RFC 7232)
    const USE_PROXY                         = 305; // The requested resource is available only through a proxy, the address for which is provided in the response (since HTTP/1.1)
    const SWITCH_PROXY                      = 306; // No longer used
    const TEMPORARY_REDIRECT                = 307; // In this case, the request should be repeated with another URI; however, future requests should still use the original URI (since HTTP/1.1)
    const PERMANENT_REDIRECT                = 308; // the request and all future requests should be repeated using another uri (rfc 7538)


    const BAD_REQUEST                       = 400; // The server cannot or will not process the request due to an apparent client error
    const UNAUTHORIZED                      = 401; // Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided (RFC 7235)
    const PAYMENT_REQUIRED                  = 402; // Reserved for future use
    const FORBIDDEN                         = 403; // The request was valid, but the server is refusing action
    const NOT_FOUND                         = 404; // The requested resource could not be found but may be available in the future
    const METHOD_NOT_ALLOWED                = 405; // A request method is not supported for the requested resource
    const NOT_ACCEPTABLE                    = 406; // The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request
    const PROXY_AUTHENTICATION_REQUIRED     = 407; // The client must first authenticate itself with the proxy (RFC 7235)
    const REQUEST_TIMEOUT                   = 408; // The server timed out waiting for the request
    const CONFLICT                          = 409; // Indicates that the request could not be processed because of conflict in the current state of the resource
    const GONE                              = 410; // Indicates that the resource requested is no longer available and will not be available again.
    const LENGTH_REQUIRED                   = 411; // The request did not specify the length of its content
    const PRECONDITION_FAILED               = 412; // The server does not meet one of the preconditions that the requester put on the request (RFC 7232)
    const PAYLOAD_TOO_LARGE                 = 413; // The request is larger than the server is willing or able to process (RFC 7231)
    const URI_TOO_LONG                      = 414; // The URI provided was too long for the server to process (RFC 7231)
    const UNSUPPORTED_MEDIA_TYPE            = 415; // The request entity has a media type which the server or resource does not support
    const RANGE_NOT_SATISFIABLE             = 416; // The client has asked for a portion of the file (byte serving), but the server cannot supply that portion (RFC 7233)
    const EXPECTATION_FAILED                = 417; // The server cannot meet the requirements of the Expect request-header field
    const I_AM_A_TEAPOT                     = 418; // This code was defined in 1998 as one of the traditional IETF April Fools' jokes (RFC 2324, RFC 7168)
    const MISDIRECTED_REQUEST               = 421; // The request was directed at a server that is not able to produce a response (RFC 7540)
    const UNPROCESSABLE_ENTITY              = 422; // The request was well-formed but was unable to be followed due to semantic errors (WebDAV; RFC 4918)
    const LOCKED                            = 423; // The resource that is being accessed is locked (WebDAV; RFC 4918)
    const FAILED_DEPENDENCY                 = 424; // The request failed because it depended on another request and that request failed (WebDAV; RFC 4918)
    const UPGRADE_REQUIRED                  = 426; // The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field
    const PRECONDITION_REQUIRED             = 428; // The origin server requires the request to be conditional (RFC 6585)
    const TOO_MANY_REQUESTS                 = 429; // The user has sent too many requests in a given amount of time (RFC 6585)
    const REQUEST_HEADER_FIELDS_TOO_LARGE   = 431; // The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large (RFC 6585)


    const INTERNAL_ERROR                    = 500; // A generic error message
    const NOT_IMPLEMENTED                   = 501; // The server either does not recognize the request method, or it lacks the ability to fulfil the request
    const BAD_GATEWAY                       = 502; // The server was acting as a gateway or proxy and received an invalid response from the upstream server
    const SERVICE_UNAVAILABLE               = 503; // The server is currently unavailable (because it is overloaded or down for maintenance)
    const GATEWAY_TIMEOUT                   = 504; // The server was acting as a gateway or proxy and did not receive a timely response from the upstream server
    const HTTP_VERSION_NOT_SUPPORTED        = 505; // The server does not support the HTTP protocol version used in the request
    const VARIANT_ALSO_NEGOTIATES           = 506; // Transparent content negotiation for the request results in a circular reference (RFC 2295)
    const INSUFFICIENT_STORAGE              = 507; // The server is unable to store the representation needed to complete the request (WebDAV; RFC 4918)
    const LOOP_DETECTED                     = 508; // The server detected an infinite loop while processing the request (WebDAV; RFC 5842)
    const NOT_EXTENDED                      = 510; // Further extensions to the request are required for the server to fulfill it (RFC 2774)
    const NETWORK_AUTHENTICATION_REQUIRED   = 511; // The client needs to authenticate to gain network access (RFC 6585)
}