import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useArticleStore } from "../../store/useArticleStore";
import { useToastStore } from "../../store/useToastStore";
import type { Article } from "../../types/article";
import styles from "./EditArticleModal.module.css"; // Скопируй стили из CreateArticleModal

// Схема такая же
const schema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    image_url: z.string().url().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    article: Article;
}

function EditArticleModal({ isOpen, onClose, article }: Props) {
    const { updateArticle, isLoading } = useArticleStore();
    const { addToast } = useToastStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                title: article.title,
                content: article.content,
                image_url: article.image_url || "",
            });
        }
    }, [isOpen, article, reset]);

    // Сброс формы при открытии/закрытии не нужен, т.к. данные берутся из article
    // Но нужно убедиться, что при закрытии мы не мутируем стейт статьи

    const onSubmit = async (data: FormValues) => {
        try {
            await updateArticle(article.id, data);
            addToast({ message: "Статья обновлена", type: "success" });
            onClose();
        } catch {
            addToast({ message: "Ошибка сохранения", type: "error" });
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Редактирование статьи</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.field}>
                        <label>Заголовок</label>
                        <input
                            {...register("title")}
                            className={errors.title ? styles.errorInput : ""}
                        />
                        {errors.title && (
                            <span className={styles.errorText}>
                                {errors.title.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>Ссылка на обложку</label>
                        <input
                            {...register("image_url")}
                            placeholder="https://..."
                        />
                        {errors.image_url && (
                            <span className={styles.errorText}>
                                {errors.image_url.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label>Текст (Markdown)</label>
                        <textarea
                            {...register("content")}
                            rows={5}
                            className={errors.content ? styles.errorInput : ""}
                        />
                        {errors.content && (
                            <span className={styles.errorText}>
                                {errors.content.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" disabled={isLoading}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EditArticleModal;
