import {
    SpotifyWidgetDefaultView,
    SpotifyTimeRange,
    NewsCategory,
    NewsCountry,
    SpotifyTopItemsType
} from '@/types/DashConfig'


export const dashConfig = {
    spotify: {
        widget: {
            title: "Most Played This Month",
            view: SpotifyWidgetDefaultView.TOP_ITEMS,
        },
        options: {
            topItemsTimeRange: SpotifyTimeRange.SHORT,
            topItemsLimit: 8,
            topItemsType: SpotifyTopItemsType.TRACKS,
        }
    },
    news: {
        endpoint: 'https://newsapi.org/v2/top-headlines',
        options: {
            count: 4,
            country: NewsCountry.UNITED_STATES,
            category: NewsCategory.TECH
        },
        cache: {
            minutes: 30
        }
    },
    quotes: {
        endpoint: 'https://quotes.rest/qod',
        options: {
            language: 'en'
        },
        cache: {
            minutes: 720  // 12 hours
        }
    }
}