import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArticleStore } from "../../store/useArticleStore";
import CommentSection from "../../components/CommentSection/CommentSection";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";
import EditArticleModal from "../../components/EditArticleModal/EditArticleModal";
import styles from "./ArticleDetailPage.module.css";

function ArticleDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { addToast } = useToastStore();
    const {
        currentArticle,
        isLoading,
        error,
        fetchArticleById,
        deleteArticle,
    } = useArticleStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Для выпадающего меню
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            fetchArticleById(parseInt(id));
        }
    }, [id, fetchArticleById]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isOwner =
        user && currentArticle && user.id === currentArticle.author_id;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const getCategoryLabel = (cat: string | null) => {
        switch (cat) {
            case "news":
                return "📰 Новости";
            case "guide":
                return "📚 Гайд";
            case "discussion":
                return "💬 Обсуждение";
            default:
                return "Статья";
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Удалить статью? Это действие нельзя отменить.")) {
            try {
                await deleteArticle(currentArticle!.id);
                addToast({ message: "Статья удалена", type: "success" });
                navigate("/community");
            } catch {
                addToast({ message: "Ошибка удаления", type: "error" });
            }
        }
    };

    if (isLoading)
        return <div className={styles.container}>Загрузка статьи...</div>;
    if (error) return <div className={styles.container}>Ошибка: {error}</div>;
    if (!currentArticle)
        return <div className={styles.container}>Статья не найдена</div>;

    return (
        <div className={styles.container}>
            <button
                className={styles.backBtn}
                onClick={() => navigate("/community")}>
                ← Назад к списку
            </button>

            <article className={styles.article}>
                {/* --- ШАПКА С МЕНЮ --- */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.category}>
                            {getCategoryLabel(currentArticle.category)}
                        </span>
                        <h1 className={styles.title}>{currentArticle.title}</h1>
                        <div className={styles.meta}>
                            <span>
                                📅 {formatDate(currentArticle.created_at)}
                            </span>
                            <span>
                                👤{" "}
                                {currentArticle.author_id
                                    ? `Автор #${currentArticle.author_id}`
                                    : "Админ"}
                            </span>
                        </div>
                    </div>

                    {/* 🔥 Выпадающее меню (только для автора) */}
                    {isOwner && (
                        <div className={styles.dropdownWrapper} ref={menuRef}>
                            <button
                                className={styles.dotsBtn}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                •••
                            </button>
                            {isMenuOpen && (
                                <div className={styles.dropdownMenu}>
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(true);
                                            setIsMenuOpen(false);
                                        }}>
                                        Редактировать
                                    </button>
                                    <button
                                        className={styles.deleteOption}
                                        onClick={handleDelete}>
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {currentArticle.image_url && (
                    <img
                        src={currentArticle.image_url}
                        alt={currentArticle.title}
                        className={styles.cover}
                    />
                )}

                <div className={styles.content}>
                    <p>{currentArticle.content}</p>
                </div>

                {currentArticle.category === "discussion" && (
                    <CommentSection articleId={currentArticle.id} />
                )}
            </article>

            <EditArticleModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                article={currentArticle}
            />
        </div>
    );
}

export default ArticleDetailPage;
