import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const rapidApiKey = import.meta.env.VITE_RAPID_API_ARITCLE_KEY

export const articleApi = createApi(<any>{

    reducerPath: 'articleApi',

    baseQuery: fetchBaseQuery({
        baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
        prepareHeaders: (headers: Headers) => {
            headers.set('X-RapidAPI-Key', "7489783a7amshf0c4b41472678fcp1cbe8fjsn4c526a3587eb")
            headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com')
            return headers
        }
    }),

    endpoints: (builder: any) => ({
        getSummary: builder.query({
            query: (params: any) => `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
        })
    }),
})

export const { useLazyGetSummaryQuery }: any = articleApi