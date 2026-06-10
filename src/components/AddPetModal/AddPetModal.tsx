import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "../../store/useModalStore";
import { petSchema, type PetForm } from "../../schemas/pet";
import { api } from "../../lib/api";
import styles from "./AddPetModal.module.css";

interface AddPetModalProps {
    onSubmit: (data: PetForm) => void;
    initialCoords?: { lat: number; lng: number } | null;
    onRequestMapPick: () => void;
}

function AddPetModal({
    onSubmit,
    initialCoords,
    onRequestMapPick,
}: AddPetModalProps) {
    const { isAddPetOpen, closeAddPet, initialStatus } = useModalStore();

    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null,
    );
    const [generalError, setGeneralError] = useState<string | null>(null);

    // 🆕 Состояния для загрузки изображения
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Синхронизация координат из MapPage
    useEffect(() => {
        if (initialCoords) setCoords(initialCoords);
    }, [initialCoords]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<PetForm>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            status: initialStatus || "lost",
            name: "",
            type: "dog",
            description: "",
            date: new Date().toISOString().split("T")[0],
            city: "",
            image: null,
            contact_phone: "",
        },
    });

    useEffect(() => {
        if (isAddPetOpen) {
            reset({
                status: initialStatus || "lost", // ← УСТАНАВЛИВАЕМ СТАТУС
                name: "",
                type: "dog",
                description: "",
                date: new Date().toISOString().split("T")[0],
                city: "",
                contact_phone: "",
            });
            setImageFile(null);
            setImagePreview(null);
        }
    }, [isAddPetOpen, initialStatus, reset]);

    useEffect(() => {
        if (isAddPetOpen) {
            setIsVisible(true);
            setIsSubmitting(false);
            setCoords(null);
            handleRemoveImage(); // Сбрасываем изображение
            document.body.style.overflow = "hidden";
        } else {
            handleClose();
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isAddPetOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
            reset();
            handleRemoveImage();
            closeAddPet();
        }, 400);
    };

    // 🆕 Обработка выбора файла
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Проверка размера (5 МБ)
            if (file.size > 5 * 1024 * 1024) {
                alert("Файл слишком большой. Максимальный размер: 5 МБ");
                return;
            }

            // Проверка типа
            if (!file.type.startsWith("image/")) {
                alert("Пожалуйста, выберите изображение");
                return;
            }

            setImageFile(file);

            // Создаём превью
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 🆕 Удаление изображения
    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ✅ Исправленная функция отправки (теперь с загрузкой изображения)
    const handleFormSubmit = async (data: PetForm) => {
        setIsSubmitting(true);
        setGeneralError(null);

        try {
            let imageUrl: string | null = null;

            // 1. Загружаем изображение (если есть)
            if (imageFile) {
                setUploadProgress(10);
                const formDataUpload = new FormData();
                formDataUpload.append("file", imageFile);

                const uploadResponse = await api.upload<{ url: string }>(
                    "/uploads/image",
                    formDataUpload,
                );
                imageUrl = uploadResponse.url;
                setUploadProgress(100);
            }

            // 2. Передаём данные с URL изображения
            const finalData = {
                ...data,
                image: imageUrl, // ← URL из Bucket.ru
            };

            await onSubmit(finalData);
            handleClose();
        } catch (error: any) {
            console.error("Ошибка создания объявления:", error);

            // 5. Показываем ошибку, но НЕ закрываем модалку
            const errorMessage =
                error.message || "Произошла ошибка при создании объявления";
            setGeneralError(errorMessage);

            setTimeout(() => {
                const errorElement = document.querySelector(
                    `.${styles.generalError}`,
                );
                errorElement?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    // ✅ Функция вызова карты
    const handlePickClick = () => {
        onRequestMapPick();
    };

    if (!isVisible) return null;

    return (
        <div
            className={`${styles.modalOverlay} ${isClosing ? styles.closing : ""}`}>
            <div className={styles.overlay} onClick={handleClose} />

            <div
                className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>

                <h2 className={styles.title}>Добавить объявление</h2>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className={styles.form}>
                    {/* Статус */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Статус</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioButton}>
                                <input
                                    type="radio"
                                    value="lost"
                                    {...register("status")}
                                />
                                <span className={styles.radioIcon}>🔴</span>{" "}
                                Пропал
                            </label>
                            <label className={styles.radioButton}>
                                <input
                                    type="radio"
                                    value="found"
                                    {...register("status")}
                                />
                                <span className={styles.radioIcon}>🟢</span>{" "}
                                Найден
                            </label>
                        </div>
                        {errors.status && (
                            <span className={styles.error}>
                                {errors.status.message}
                            </span>
                        )}
                    </div>

                    {/* Кличка и Тип */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Кличка</label>
                            <input
                                type="text"
                                placeholder="Например: Рекс"
                                {...register("name")}
                                className={styles.input}
                            />
                            {errors.name && (
                                <span className={styles.error}>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                Тип животного
                            </label>
                            <select
                                {...register("type")}
                                className={styles.select}>
                                <option value="dog">🐕 Собака</option>
                                <option value="cat">🐈 Кошка</option>
                                <option value="other">🐾 Другое</option>
                            </select>
                            {errors.type && (
                                <span className={styles.error}>
                                    {errors.type.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Описание */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Описание</label>
                        <textarea
                            rows={3}
                            placeholder="Порода, возраст..."
                            {...register("description")}
                            className={styles.textarea}
                        />
                        {errors.description && (
                            <span className={styles.error}>
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    {/* 🆕 Загрузка изображения */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Фото питомца</label>

                        {!imagePreview ? (
                            <div
                                className={styles.uploadArea}
                                onClick={() => fileInputRef.current?.click()}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    style={{ display: "none" }}
                                />
                                <div className={styles.uploadPlaceholder}>
                                    <span className={styles.uploadIcon}>
                                        📷
                                    </span>
                                    <p>Нажмите для выбора фото</p>
                                    <small>JPG, PNG, WEBP (макс. 5 МБ)</small>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.imagePreview}>
                                <img src={imagePreview} alt="Preview" />
                                <button
                                    type="button"
                                    className={styles.removeBtn}
                                    onClick={handleRemoveImage}>
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Город + Кнопка карты */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Город / Адрес</label>
                        <div className={styles.cityInputRow}>
                            <input
                                type="text"
                                placeholder="Введите город"
                                {...register("city")}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                className={styles.mapPickBtn}
                                onClick={handlePickClick}>
                                📍 На карте
                            </button>
                        </div>

                        {coords && (
                            <div className={styles.coordsIndicator}>
                                ✅ Место указано на карте (
                                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                                )
                            </div>
                        )}

                        {errors.city && (
                            <span className={styles.error}>
                                {errors.city.message}
                            </span>
                        )}
                    </div>

                    {/* Дата */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Дата</label>
                        <input
                            type="date"
                            {...register("date")}
                            className={styles.input}
                        />
                        {errors.date && (
                            <span className={styles.error}>
                                {errors.date.message}
                            </span>
                        )}
                    </div>

                    {/* Номер телефона */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Контактный телефон
                        </label>
                        <input
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            {...register("contact_phone")}
                            className={styles.input}
                        />
                        {errors.contact_phone && (
                            <span className={styles.error}>
                                {errors.contact_phone.message}
                            </span>
                        )}
                        <small className={styles.hint}>
                            Для связи с вами (не будет опубликован)
                        </small>
                    </div>

                    {/* Кнопки действий */}
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleClose}>
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}>
                            {isSubmitting
                                ? uploadProgress > 0 && uploadProgress < 100
                                    ? `Загрузка... ${uploadProgress}%`
                                    : "Публикация..."
                                : "Опубликовать"}
                        </button>
                    </div>

                    {generalError && (
                        <div className={styles.generalError}>
                            <span className={styles.errorIcon}>⚠️</span>
                            <span className={styles.errorText}>
                                {generalError}
                            </span>
                            <button
                                type="button"
                                className={styles.dismissError}
                                onClick={() => setGeneralError(null)}>
                                ×
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddPetModal;
