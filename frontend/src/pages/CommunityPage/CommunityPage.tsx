import { useEffect, useState } from "react";
import { useArticleStore } from "../../store/useArticleStore";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import CreateArticleModal from "../../components/CreateArticleModal/CreateArticleModal";
import styles from "./CommunityPage.module.css";

function CommunityPage() {
    const { articles, fetchArticles, isLoading, error } = useArticleStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchArticles(filter === "all" ? undefined : filter);
    }, [filter]);

    const categories = [
        { key: "all", label: "Все" },
        { key: "news", label: "📰 Новости" },
        { key: "guide", label: "📚 Гайды" },
        { key: "discussion", label: "💬 Обсуждения" },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Сообщество</h1>
                <button
                    className={styles.createBtn}
                    onClick={() => setIsModalOpen(true)}>
                    + Написать статью
                </button>
            </div>

            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        className={`${styles.filterChip} ${filter === cat.key ? styles.active : ""}`}
                        onClick={() => setFilter(cat.key)}>
                        {cat.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className={styles.loading}>Загрузка статей...</div>
            ) : error ? (
                <div className={styles.error}>⚠️ {error}</div>
            ) : articles.length === 0 ? (
                <div className={styles.empty}>
                    Статей пока нет. Стань первым автором!
                </div>
            ) : (
                <div className={styles.grid}>
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}

            <CreateArticleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default CommunityPage;
