import type { Article } from "../../types/article";
import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";

interface Props {
    article: Article;
}

function ArticleCard({ article }: Props) {
    const categoryLabels: Record<string, string> = {
        news: "📰 Новости",
        guide: "📚 Гайд",
        discussion: "💬 Обсуждение",
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
        });

    return (
        <Link to={`/community/${article.id}`} className={styles.linkWrapper}>
            <div className={styles.card}>
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className={styles.cover}
                    />
                ) : (
                    <div className={styles.coverPlaceholder}>📄</div>
                )}
                <div className={styles.content}>
                    <span className={styles.category}>
                        {categoryLabels[article.category || ""] ||
                            article.category}
                    </span>
                    <h3 className={styles.title}>{article.title}</h3>
                    <p className={styles.excerpt}>
                        {article.content.replace(/[#*`]/g, "").slice(0, 100)}...
                    </p>
                    <div className={styles.meta}>
                        <span>{formatDate(article.created_at)}</span>
                        <span>
                            👤{" "}
                            {article.author_id
                                ? `Автор #${article.author_id}`
                                : "Админ"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ArticleCard;
