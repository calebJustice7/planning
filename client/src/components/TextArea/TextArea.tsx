import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface TextAreaProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: FieldError;
  label?: string;
  showErrorMessage?: boolean;
  errorInputOutline?: boolean;
  placeHolder?: string;
}

function TextArea<T extends FieldValues>({
  register,
  name,
  error,
  label,
  showErrorMessage,
  errorInputOutline,
  placeHolder,
  ...rest
}: TextAreaProps<T>) {
  return (
    <>
      <label className="form-control w-full">
        {label && <span className="text-slate-300 text-sm label pb-1.5 pl-0">{label}</span>}
        <textarea
          placeholder={placeHolder}
          {...register(name)}
          {...rest}
          className={`resize-none textarea textarea-bordered w-full rounded-md ${
            error?.message && errorInputOutline && "input-error"
          } ${rest.className}`}
        ></textarea>
      </label>
      {error?.message && showErrorMessage && <span className="text-xs text-red-600">{error.message}</span>}
    </>
  );
}

export default TextArea;
