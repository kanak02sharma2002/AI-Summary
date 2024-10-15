import { useState, useEffect } from 'react'

import { copy, linkIcon, loader, tick } from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'

const Demo = () => {

    const [article, setArticle] = useState<{ url: string; summary: string }>({
        url: "",
        summary: "",
    })

    const [allArticles, setAllArticles] = useState<any>([])
    const [copied, setCopied] = useState<string | Boolean>("")

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()

    useEffect(() => {

        const articleFromLocalStorage = JSON.parse(localStorage.getItem("articles") as string)

        if (articleFromLocalStorage) {
            setAllArticles(articleFromLocalStorage)
        }
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const { data } = await getSummary({ articleUrl: article.url })

        if (data?.summary) {

            const newArticle = { ...article, summary: data.summary }

            const updatedAllArticle = [newArticle, ...allArticles]

            setArticle(newArticle)

            setAllArticles(updatedAllArticle)

            localStorage.setItem('articles', JSON.stringify(updatedAllArticle))
        }
    }

    const handleCopy = (copyUrl: string) => {
        setCopied(copyUrl)
        navigator.clipboard.writeText(copyUrl)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <section className="mt-16 w-full max-w-xl">
            {/* Search Bar */}
            <div className='flex flex-col w-full gap-2'>
                <form onSubmit={handleSubmit} className='relative flex justify-center items-center'>
                    <img src={linkIcon} alt="link_icon" className='absolute left-0 my-2 ml-3 w-5' />
                    <input
                        type="url"
                        placeholder='Paste your article link here'
                        value={article.url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setArticle({ ...article, url: e.target.value })}
                        required
                        className='url_input peer'
                    />
                    <button
                        type='submit'
                        className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'
                    >
                        ↵
                    </button>
                </form>
                {/* Browser URL History */}
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {allArticles.map((article: any, index: number) => (
                        <div
                            key={`link-${index}`}
                            onClick={() => setArticle(article)}
                            className="link_card"
                        >
                            <div className='copy_btn' onClick={()=> handleCopy(article.url)}>
                                <img src={copied === article.url ? tick : copy} alt="copy_icon" className='w-[40%] h-[40%] object-contain' />
                            </div>
                            <p className='flex-1 font-satoshi text-blue-700 fon-medium text-sm truncate'>
                                {article.url}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Display result */}
            <div className="my-10 max-w-full flex justify-center items-center">
                {isFetching ? (
                    <img src={loader} alt="loader" className='w-20 h-20 object-contain' />
                ) : (
                    error ? (
                        <p className='font-inter font-bold text-black text-center'>
                            Well, that wasn't suppose to happen...
                            <br />
                            <span className='font-satoshi font-normal text-gray-700'>
                                {error?.data?.error}
                            </span>
                        </p>
                    ) : (
                        article.summary && (
                            <div className="flex flex-col gap-3">
                                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                                    Article <span className='blue_gradient'>Summary</span>
                                </h2>
                                <div className='summary_box'>
                                    <p className='font-inter font-medium text-sm text-gray-700'>{article.summary}</p>
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
        </section>
    )
}

export default Demo