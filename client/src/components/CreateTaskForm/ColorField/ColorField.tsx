import { useEffect } from "react";
import { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

interface ColorFieldProps<T extends FieldValues> {
    value: string;
    setValue: UseFormSetValue<T>;
}

function ColorField<T extends FieldValues>({ setValue, value }: ColorFieldProps<T>) {
    const colors = ["#cbaf0d", "#d10667", "#5e9b2c", "#0ba6aa"];

    const setColor = (color: string) => {
        setValue("color" as Path<T>, color as PathValue<T, Path<T>>);
    };

    useEffect(() => {
        setTimeout(() => {
            if (!value) setColor(colors[0]);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <span className="label text-slate-300 text-sm pb-0 pl-0 mt-6">Color</span>
            <div className="flex items-center mt-2 mb-6">
                {colors.map((color, i) => (
                    <input
                        type="radio"
                        name="color-radio"
                        onChange={() => setColor(color)}
                        checked={value === color}
                        key={i}
                        className={`radio mr-5`}
                        style={{ borderColor: color, backgroundColor: value === color ? color : "" }}
                    />
                ))}
            </div>
        </>
    );
}

export default ColorField;
