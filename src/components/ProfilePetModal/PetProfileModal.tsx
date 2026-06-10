import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    petProfileSchema,
    type PetProfileForm,
} from "../../schemas/petProfile";
import styles from "./PetProfileModal.module.css";

interface AddPetProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PetProfileForm) => void;
    initialData?: Partial<PetProfileForm>;
    isSubmitting?: boolean; // ← Загрузка из стора
    error?: string | null; // ← Ошибка из стора
}

function PetProfileModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    error = null,
    initialData = undefined,
}: AddPetProfileModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PetProfileForm>({
        resolver: zodResolver(petProfileSchema),
        defaultValues: {
            name: "",
            type: "dog",
            breed: "",
            birthDate: "",
            color: "",
            avatar: "",
            notes: "",
            isChipped: false,
            ...initialData,
        },
    });

    useEffect(() => {
        if (isOpen) {
            const defaults = {
                name: "",
                type: "dog",
                breed: "",
                birthDate: "",
                color: "",
                avatar: "",
                notes: "",
                isChipped: false,
                ...initialData,
            };
            setIsVisible(true);
            reset(defaults);
            document.body.style.overflow = "hidden";
        } else {
            setIsClosing(true);
            setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
                document.body.style.overflow = "";
                onClose();
            }, 400);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, reset, initialData, onClose]);

    const handleClose = () => {
        if (isSubmitting) return;
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            onClose();
        }, 400);
    };

    const handleFormSubmit = async (data: PetProfileForm) => {
        try {
            await onSubmit(data);
            handleClose();
        } catch (err) {
            console.error("❌ Ошибка при добавлении питомца:", err);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}>
            <div className={styles.backdrop} onClick={handleClose} />

            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}>
                <button className={styles.closeBtn} onClick={handleClose}>
                    ×
                </button>
                <h2 className={styles.title}>Добавить питомца</h2>
                <p className={styles.subtitle}>
                    Заполните профиль, чтобы быстро создавать объявления
                </p>

                {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Кличка</label>
                        <input
                            type="text"
                            placeholder="Например: Бобик"
                            {...register("name")}
                            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <span className={styles.error}>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Тип животного
                            </label>
                            <select
                                {...register("type")}
                                className={styles.select}
                                disabled={isSubmitting}>
                                <option value="dog">🐕 Собака</option>
                                <option value="cat">🐈 Кошка</option>
                                <option value="other">🐾 Другое</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Порода</label>
                            <input
                                type="text"
                                placeholder="Необязательно"
                                {...register("breed")}
                                className={styles.input}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Дата рождения
                            </label>
                            <input
                                type="date"
                                {...register("birthDate")}
                                className={styles.input}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>
                                Окрас / Приметы
                            </label>
                            <input
                                type="text"
                                placeholder="Например: Рыжий"
                                {...register("color")}
                                className={styles.input}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Ссылка на фото</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            {...register("avatar")}
                            className={`${styles.input} ${errors.avatar ? styles.inputError : ""}`}
                            disabled={isSubmitting}
                        />
                        {errors.avatar && (
                            <span className={styles.error}>
                                {errors.avatar.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Заметки</label>
                        <textarea
                            rows={3}
                            placeholder="Особенности характера, привычки..."
                            {...register("notes")}
                            className={styles.textarea}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.checkboxField}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                {...register("isChipped")}
                                disabled={isSubmitting}
                            />
                            <span className={styles.checkboxCustom}></span>
                            Питомец чипирован
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={handleClose}
                            disabled={isSubmitting}>
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting}>
                            {isSubmitting
                                ? "Сохранение..."
                                : "Добавить питомца"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PetProfileModal;
