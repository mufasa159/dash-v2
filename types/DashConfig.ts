/**
 * SpotifyTimeRange enum represents the time range for
 * the Spotify API's top tracks endpoint. The default
 * value is 'medium_term'.
 * 
 * More information:
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export enum SpotifyTimeRange {
    SHORT = 'short_term',
    MEDIUM = 'medium_term',
    LONG = 'long_term'
}


/**
 * SpotifyTopTracksType enum represents the type of
 * data that should be returned from the Spotify API's
 * top tracks endpoint. The default value is 'tracks'.
 * 
 * More information:
 * https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
 */
export enum SpotifyTopItemsType {
    ARTISTS = 'artists',
    TRACKS = 'tracks'
}


/**
 * An enum that represents the default view for the
 * Spotify widget, used in the `dashConfig` object.
 */
export enum SpotifyWidgetDefaultView {
    TOP_ITEMS = 'top-items',
    NOW_PLAYING = 'now-playing'
}


/**
 * NewsCategory enum represents the different categories
 * of top headlines that can be fetched from the News API.
 * 
 * More information:
 * https://newsapi.org/docs/endpoints/top-headlines
 */
export enum NewsCategory {
    BUSINESS = 'business',
    ENTERTAINMENT = 'entertainment',
    GENERAL = 'general',
    HEALTH = 'health',
    SCIENCE = 'science',
    SPORTS = 'sports',
    TECH = 'technology'
}


/**
 * NewsCountry enum represents the different countries
 * that can be used to fetch data from the News API.
 * 
 * More information:
 * https://newsapi.org/docs/endpoints/sources
 */
export enum NewsCountry {
    UNITED_ARAB_EMIRATES = "ae",
    ARGENTINA = "ar",
    AUSTRIA = "at",
    AUSTRALIA = "au",
    BELGIUM = "be",
    BULGARIA = "bg",
    BRAZIL = "br",
    CANADA = "ca",
    SWITZERLAND = "ch",
    CHINA = "cn",
    COLOMBIA = "co",
    CUBA = "cu",
    CZECH_REPUBLIC = "cz",
    GERMANY = "de",
    EGYPT = "eg",
    FRANCE = "fr",
    UNITED_KINGDOM = "gb",
    GREECE = "gr",
    HONG_KONG = "hk",
    HUNGARY = "hu",
    INDONESIA = "id",
    IRELAND = "ie",
    ISRAEL = "il",
    INDIA = "in",
    ITALY = "it",
    JAPAN = "jp",
    SOUTH_KOREA = "kr",
    LITHUANIA = "lt",
    LATVIA = "lv",
    MOROCCO = "ma",
    MEXICO = "mx",
    MALAYSIA = "my",
    NIGERIA = "ng",
    NETHERLANDS = "nl",
    NORWAY = "no",
    NEW_ZEALAND = "nz",
    PHILIPPINES = "ph",
    POLAND = "pl",
    PORTUGAL = "pt",
    ROMANIA = "ro",
    SERBIA = "rs",
    RUSSIA = "ru",
    SAUDI_ARABIA = "sa",
    SWEDEN = "se",
    SINGAPORE = "sg",
    SLOVENIA = "si",
    SLOVAKIA = "sk",
    THAILAND = "th",
    TURKEY = "tr",
    TAIWAN = "tw",
    UKRAINE = "ua",
    UNITED_STATES = "us",
    VENEZUELA = "ve",
    SOUTH_AFRICA = "za",
}