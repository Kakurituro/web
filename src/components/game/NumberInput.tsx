import { Controller, useFormContext } from "react-hook-form";

type NumberInputProps = {
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
};

export default function NumberInput({
  name,
  defaultValue,
  min = 0,
  max = 99,
}: NumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <input
          type="number"
          min={min}
          max={max}
          className="font-Barlow text-black text-[7.4vw] h-[1em] w-[2ch] p-0 leading-none text-center outline-0 no-spin"
          {...field}
          onChange={(e) => {
            let val = e.target.valueAsNumber;
            if (isNaN(val)) {
              field.onChange(e.target.value); // 空文字や非数値も受け入れる
            } else {
              field.onChange(Math.min(max, Math.max(min, val)));
            }
          }}
          onFocus={(e) => {
            if (e.target.value === "0") {
              field.onChange("");
            }
          }}
          onBlur={(e) => {
            let val = e.target.valueAsNumber;
            if (isNaN(val) || val < min) {
              field.onChange(min);
            } else if (val > max) {
              field.onChange(max);
            }
          }}
        />
      )}
    />
  );
}
