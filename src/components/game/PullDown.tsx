import type { UseFormRegisterReturn } from "react-hook-form";

type Option = {
  id: string;
  name: string;
};

type PullDownProps = {
  options: Option[];
  register: UseFormRegisterReturn;
};

export default function PullDown({ options, register }: PullDownProps) {
  return (
    <select
      className="border-gray-300 text-[2svh] rounded-full text-black border-2 font-MoboBold w-[60svw] text-center py-[0.1svh]"
      {...register}
      defaultValue=""
    >
      <option value="" disabled className="text-blacksub">
        選択してください
      </option>
      {options.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
