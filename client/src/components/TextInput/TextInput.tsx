import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface TextInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  label?: string;
  showErrorMessage?: boolean;
  errorInputOutline?: boolean;
  placeholder?: string;
  type?: "text" | "number";
}

function TextInput<T extends FieldValues>({
  name,
  register,
  error,
  label,
  showErrorMessage,
  errorInputOutline = true,
  placeholder,
  type,
  ...rest
}: TextInputProps<T>) {
  return (
    <>
      <label className="form-control w-full">
        {label && <span className="text-slate-300 text-sm label pb-1.5 pl-0">{label}</span>}

        <input
          type={type || "text"}
          placeholder={placeholder}
          className={`input input-bordered w-full rounded-md ${error?.message && errorInputOutline && "input-error"}`}
          {...register(name)}
          {...rest}
        />
      </label>

      {error?.message && showErrorMessage && <span className="text-xs text-red-600">{error.message}</span>}
    </>
  );
}

export default TextInput;
