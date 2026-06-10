import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    petProfileSchema,
    type PetProfileForm,
    type PetProfile,
} from "../../schemas/petProfile";
import { usePetStore } from "../../store/usePetStore";
import styles from "./PetProfileModal.module.css";

interface PetProfileModalProps {
    isOpen?: boolean;
    pet?: PetProfile | null;
    onClose: () => void;
    onSubmit?: (formData: PetProfileForm) => Promise<void>; // ← Вернули имя onSubmit
    initialData?: Partial<PetProfileForm>;
    isSubmitting?: boolean;
    error?: string | null;
}

function PetProfileModal({
    isOpen,
    pet,
    onClose,
    onSubmit, // ← Пропс называется onSubmit
    initialData: _initialData,
    isSubmitting: _isSubmitting,
    error: _error,
}: PetProfileModalProps) {
    const addPetProfile = usePetStore((state) => state.addPetProfile);
    const updatePetProfile = usePetStore((state) => state.updatePetProfile);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PetProfileForm>({
        resolver: zodResolver(petProfileSchema),
        defaultValues: {
            name: "",
            type: "dog",
            isChipped: false,
            breed: "",
            birthDate: "",
            color: "",
            avatar: "",
            notes: "",
        },
    });

    useEffect(() => {
        if (pet) {
            reset({
                name: pet.name || "",
                type: (pet.type || "dog") as "dog" | "cat" | "other",
                isChipped: pet.is_chipped || false,
                breed: pet.breed || "",
                birthDate: pet.birth_date || "",
                color: pet.color || "",
                avatar: pet.avatar || "",
                notes: pet.notes || "",
            });
        } else {
            reset({
                name: "",
                type: "dog",
                isChipped: false,
                breed: "",
                birthDate: "",
                color: "",
                avatar: "",
                notes: "",
            });
        }
    }, [pet, reset]);

    // ✅ Внутренняя функция с ДРУГИМ именем, чтобы не конфликтовать с пропсом
    const handleFormSubmit = async (data: PetProfileForm) => {
        try {
            if (onSubmit) {
                await onSubmit(data);
            } else if (pet) {
                await updatePetProfile(pet.id, data);
            } else {
                await addPetProfile(data);
            }
            onClose();
        } catch (error) {
            console.error("Ошибка сохранения профиля:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.content}>
                <h2>
                    {pet ? "Редактировать профиль" : "Новый профиль питомца"}
                </h2>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className={styles.formGroup}>
                        <label>Имя</label>
                        <input
                            {...register("name")}
                            placeholder="Введите имя"
                        />
                        {errors.name && (
                            <span className={styles.error}>
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Тип</label>
                        <select {...register("type")}>
                            <option value="dog">Собака</option>
                            <option value="cat">Кошка</option>
                            <option value="other">Другое</option>
                        </select>
                        {errors.type && (
                            <span className={styles.error}>
                                {errors.type.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input type="checkbox" {...register("isChipped")} />
                            Чипирован
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Порода</label>
                        <input
                            {...register("breed")}
                            placeholder="Введите породу"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Дата рождения</label>
                        <input {...register("birthDate")} type="date" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Окрас</label>
                        <input
                            {...register("color")}
                            placeholder="Введите окрас"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>URL аватара</label>
                        <input
                            {...register("avatar")}
                            placeholder="https://..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Заметки</label>
                        <textarea
                            {...register("notes")}
                            placeholder="Дополнительная информация"
                        />
                    </div>

                    {_error && <div className={styles.error}>{_error}</div>}

                    <div className={styles.buttons}>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={_isSubmitting}>
                            {_isSubmitting ? "Сохранение..." : "Сохранить"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelBtn}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PetProfileModal;
