interface TwitterEmbedProps {
    url: string;
}

export default function TwitterEmbed({ url }: TwitterEmbedProps) {
    const twitterUrl = url.replace("x.com", "twitter.com");

    return (
        <div className="twitter-embed-container my-4 flex justify-center">
            <blockquote className="twitter-tweet" data-theme="dark">
                <a href={twitterUrl}>{twitterUrl}</a>
            </blockquote>
        </div>
    );
}
