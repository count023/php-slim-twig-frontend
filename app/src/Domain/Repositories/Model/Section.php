<?php
/**
 * Created by count0 for php-slim-twig-frontend
 * Date: 22.08.2018
 * Time: 20:48
 */

namespace App\Domain\Repositories\Model;


/**
 * Class Section
 * @package App\Domain\Repositories\Model
 *
 *
 * JSON from content-api:
 * <code>
 * homeSection": {
 *     "sectionId": 29207,
 *     "state": "published",
 *     "name": "Digital Life",
 *     "uniqueName": "digital life",
 *     "directoryName": "digital-life",
 *     "directoryPath": "digital-life/",
 *     "subsections": [],
 *     "parent": { // => Section
 *         "sectionId": 28435,
 *         "state": "published",
 *         "name": "Futurezone",
 *         "uniqueName": "ece_frontpage",
 *         "directoryName": "frontpage",
 *         "directoryPath": "",
 *         "subsections": [],
 *         "parameter": {},
 *         "parent": null
 *     },
 *     "parameter": {
 *         "article_config_type_youtube": "config.article.type.video",
 *         "article_config_type_sales": "config.article.type.news",
 *         "section_feed_description": "Aktuelle Nachrichten aus den Bereichen Technologie, Digital Life, StartUps, Science und Games",
 *         "dfp_site": "futurezone.de",
 *         "publication_title": "futurezone.de",
 *         "section_description": "Neues, Kurioses und Spannendes für Geeks, Nerds und andere User der digitalen Welt.",
 *         "article_config_type_printimport": "config.article.type.news",
 *         "render_resources_at_end": "true",
 *         "inline_video_playback": "true",
 *         "dfp_site_video": "sta_futurezone",
 *         "dfp_slotsize_video_mobile": "640x480",
 *         "article_config_type_expert": "config.article.type.news",
 *         "section_cssClass": "digitallife",
 *         "publication_logo": "<URL DES LOGOS FÜR DEN HEADER>",
 *         "publication_facebook_pages": "1015222118622731",
 *         "images_publicationUrl": "https://img.futurezone.de/",
 *         "video_brightcove_playerId": "Sk8p3fe7W",
 *         "article_config_type_recipe": "config.article.type.news",
 *         "dfp_lokinfo": "true",
 *         "article_config_type_opinion": "config.article.type.news",
 *         "video_brightcove_masterPlayerId": "Sk8p3fe7W",
 *         "agof_code_article": "00000_HOME",
 *         "agof_code_section": "00000_HOME",
 *         "dfp_site_video_mobile": "mob_futurezone",
 *         "section_feed_copyright": "(c) FUNKE Digital. RSS Meldungen dürfen nur unverändert wiedergegeben und ausschließlich online verwendet werden. Die eingeräumten Nutzungsrechte beinhalten ausdrücklich nicht das Recht zur Weitergabe an Dritte. Insbesondere ist es nicht gestattet, die Daten auf öffentlichen Screens oder zum Download anzubieten - weder kostenlos noch kostenpflichtig.",
 *         "article_config_type_ticker": "config.article.type.news",
 *         "gotama_account": "GTM-MTTMLXJ",
 *         "section_methode_no_export": "true",
 *         "agof_code_gallery": "00000_HOME",
 *         "agof_code_video": "00000_HOME",
 *         "dfp_slotsize_video": "640x480",
 *         "section_title": "Digital Life",
 *         "article_config_type_stockreport": "config.article.type.news",
 *         "section_keywords": "Digital Life, Trend, Entertainment, Social Media, Smart Home, Mobility, Internet, Web, Roboter, Gossip, WebFail",
 *         "video_brightcove_masterPlaylistPlayerId": "Sk8p3fe7W",
 *         "dfp_fd_view_active": "true",
 *         "article_config_type_leserreporter": "config.article.type.news",
 *         "article_config_type_agentur": "config.article.type.news",
 *         "traffective_scriptsrc": "//cdntrf.com/trf_futurezone.js",
 *         "section_plista": "<PLISTA-ID>",
 *         "article_config_type_advertorial": "config.article.type.news",
 *         "agof_code_ugc": "00000_HOME",
 *         "section_feed_title": "futurezone.de",
 *         "dfp_site_video_amp": "amp_futurezone",
 *         "video_brightcove_playlistPlayerId": "Sk8p3fe7W",
 *         "stroer_site_amp": "amp_futurezone",
 *         "publication_facebook_AppId": "142355443017343",
 *         "dfp_zone": "digital-life",
 *         "dfp_fd_video_view_active": "true"
 *     }
 * }
 * </code>
 */
class Section {

    /**
     * @var integer
     * @MarshallProperty(name="sectionId", type="int")
     */
    public $id;
    /**
     * TODO: State-Enum?
     * @var string
     * @MarshallProperty(name="state", type="string")
     */
    public $state;
    /**
     * @var string
     * @MarshallProperty(name="name", type="string")
     */
    public $name;
    /**
     * @var string
     * @MarshallProperty(name="uniqueName", type="string")
     */
    public $uniqueName;
    /**
     * @var string
     * @MarshallProperty(name="directoryName", type="string")
     */
    public $directoryName;
    /**
     * @var string
     * @MarshallProperty(name="directoryPath", type="string")
     */
    public $directoryPath;
    /**
     * @var Section[]
     * @MarshallProperty(name="subsections", type="App\Domain\Repositories\Model\Section[]")
     */
    public $subsections;
    /**
     * @var Section
     * @MarshallProperty(name="parent", type="App\Domain\Repositories\Model\Section")
     */
    public $parent;
    /**
     * @var array<string, string>
     * @MarshallProperty(name="parameter", type="array")
     */
    public $parameter;

}