import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useArticleStore } from "../../store/useArticleStore";
import { useToastStore } from "../../store/useToastStore";
import styles from "./CreateArticleModal.module.css";

const schema = z.object({
    title: z.string().min(3, "Минимум 3 символа"),
    content: z.string().min(10, "Минимум 10 символов"),
    image_url: z
        .string()
        .url("Введите корректный URL")
        .optional()
        .or(z.literal("")),
    category: z.enum(["news", "guide", "discussion"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function CreateArticleModal({ isOpen, onClose }: Props) {
    const [isClosing, setIsClosing] = useState(false);
    const { createArticle, isLoading } = useArticleStore();
    const { addToast } = useToastStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            image_url: "",
            category: "guide",
        },
    });

    useEffect(() => {
        if (isOpen) reset();
    }, [isOpen, reset]);

    const handleOverlayClick = () => {
        if (!isLoading) onClose();
    };

    const onSubmit = async (data: FormValues) => {
        try {
            await createArticle(data);
            addToast({ message: "Статья опубликована!", type: "success" });
            onClose();
        } catch {
            addToast({ message: "Ошибка при создании", type: "error" });
        }
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div
            className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
            onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>Новая статья</h2>
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
                        <label>Категория</label>
                        <select {...register("category")}>
                            <option value="guide">📚 Гайд</option>
                            <option value="news">📰 Новости</option>
                            <option value="discussion">💬 Обсуждение</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Ссылка на обложку</label>
                        <input
                            {...register("image_url")}
                            placeholder="https://..."
                        />
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
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}>
                            Отмена
                        </button>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Публикация..." : "Опубликовать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateArticleModal;
