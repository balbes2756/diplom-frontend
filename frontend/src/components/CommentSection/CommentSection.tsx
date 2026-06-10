import { useEffect, useState, useRef } from "react";
import { useCommentStore } from "../../store/useCommentStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";
import styles from "./CommentSection.module.css";

interface Props {
    articleId: number;
}

function CommentSection({ articleId }: Props) {
    const {
        comments,
        fetchComments,
        addComment,
        editComment,
        deleteComment,
        isLoading,
    } = useCommentStore();
    const { user } = useAuthStore();
    const { addToast } = useToastStore();

    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (
    //             dropdownRef.current &&
    //             !dropdownRef.current.contains(event.target as Node)
    //         ) {
    //             setOpenDropdownId(null);
    //         }
    //     };
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () =>
    //         document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId === null) return;

            const target = event.target as HTMLElement;
            // closest поднимается вверх по DOM и ищет любой элемент с этим классом
            if (!target.closest(`.${styles.dropdownWrapper}`)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [openDropdownId]);

    useEffect(() => {
        fetchComments(articleId);
    }, [articleId, fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(articleId, text);
            setText("");
            addToast({ message: "Комментарий добавлен", type: "success" });
        } catch {
            addToast({ message: "Ошибка", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveEdit = async (commentId: number) => {
        if (!editText.trim()) return;
        try {
            await editComment(articleId, commentId, editText);
            setEditingId(null);
            addToast({ message: "Обновлено", type: "success" });
        } catch {
            addToast({ message: "Ошибка", type: "error" });
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!window.confirm("Удалить?")) return;
        try {
            await deleteComment(articleId, commentId);
            addToast({ message: "Удалено", type: "success" });
            setOpenDropdownId(null);
        } catch {
            addToast({ message: "Ошибка", type: "error" });
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Комментарии ({comments.length})</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Написать комментарий..."
                    disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting || !text.trim()}>
                    {isSubmitting ? "..." : "Отправить"}
                </button>
            </form>

            <div className={styles.list}>
                {isLoading ? (
                    <p className={styles.loading}>Загрузка...</p>
                ) : comments.length === 0 ? (
                    <p className={styles.empty}>Нет комментариев</p>
                ) : (
                    comments.map((comment) => {
                        const isOwner =
                            user && Number(comment.user_id) === Number(user.id);
                        const isEditing = editingId === comment.id;
                        const isOpen = openDropdownId === comment.id;
                        console.log(`🔍 Comment #${comment.id}:`, {
                            myId: user?.id,
                            authorId: comment.user_id,
                            types: `user:${typeof user?.id} vs comment:${typeof comment.user_id}`,
                            isOwner:
                                user &&
                                Number(comment.user_id) === Number(user.id),
                        });

                        return (
                            <div key={comment.id} className={styles.item}>
                                <div className={styles.avatar}>
                                    {comment.author_avatar ? (
                                        <img
                                            src={comment.author_avatar}
                                            alt={comment.author_name}
                                        />
                                    ) : (
                                        <span>
                                            {comment.author_name?.[0]?.toUpperCase() ||
                                                "?"}
                                        </span>
                                    )}
                                </div>

                                <div className={styles.body}>
                                    <div className={styles.header}>
                                        <div className={styles.headerWrapper}>
                                            <span className={styles.user}>
                                                {comment.author_name}
                                            </span>
                                            <span className={styles.date}>
                                                {new Date(
                                                    comment.created_at,
                                                ).toLocaleString("ru-RU")}
                                            </span>
                                        </div>

                                        {isOwner && !isEditing && (
                                            <div
                                                className={
                                                    styles.dropdownWrapper
                                                }
                                                ref={dropdownRef}>
                                                <button
                                                    className={styles.dotsBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(
                                                            isOpen
                                                                ? null
                                                                : comment.id,
                                                        );
                                                    }}>
                                                    •••
                                                </button>
                                                {isOpen && (
                                                    <div
                                                        className={
                                                            styles.dropdownMenu
                                                        }>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(
                                                                    comment.id,
                                                                );
                                                                setEditText(
                                                                    comment.text,
                                                                );
                                                                setOpenDropdownId(
                                                                    null,
                                                                );
                                                            }}>
                                                            ✏️ Изменить
                                                        </button>
                                                        <button
                                                            className={
                                                                styles.deleteOption
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    comment.id,
                                                                )
                                                            }>
                                                            🗑️ Удалить
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className={styles.editMode}>
                                            <textarea
                                                value={editText}
                                                onChange={(e) =>
                                                    setEditText(e.target.value)
                                                }
                                                autoFocus
                                                className={styles.editInput}
                                            />
                                            <div className={styles.editActions}>
                                                <button
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }>
                                                    Отмена
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleSaveEdit(
                                                            comment.id,
                                                        )
                                                    }>
                                                    Сохранить
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={styles.text}>
                                            {comment.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default CommentSection;
