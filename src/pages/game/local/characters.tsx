import { useForm, FormProvider } from "react-hook-form";
import Title from "../../../components/Title";
import CharacterSetting from "../../../components/game/CharacterSetting";
import GroupSetting from "../../../components/game/GroupSetting";
import { characters } from "../../../utils/characters";
import { groups } from "../../../utils/groups";
import isGameEstablished from "../../../utils/isGameEstablished";
import randomCharacters from "../../../utils/randomCharacters";
import { useLocalContext } from "../../../context/game/local";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavButton from "../../../components/game/NavButton";
import Announce from "../../../components/game/Announce";
import { motion } from "motion/react";
import { defaultCharacter } from "../../../utils/defaultCharacter";

export type FormValues = Record<
  string,
  {
    min: number;
    max: number;
  }
>;

const getDefaultFormValues = (count: number): FormValues => {
  return [...characters, ...groups].reduce((acc, item) => {
    const defaultSet = defaultCharacter.find((v) => v.count === count);
    const defaultValue = defaultSet?.set.find((v) => v.code === item.code);
    acc[item.code] = {
      min: defaultValue ? defaultValue.min : 0,
      max: defaultValue ? defaultValue.max : 0,
    };
    return acc;
  }, {} as FormValues);
};

export default function Characters() {
  const navigate = useNavigate();
  const {
    players: contextPlayers,
    setPlayers,
    characters: contextCharacters,
    setCharacters,
  } = useLocalContext();

  const methods = useForm<FormValues>({
    defaultValues:
      Object.keys(contextCharacters).length > 0
        ? contextCharacters
        : getDefaultFormValues(contextPlayers.length),
  });

  const [announce, setAnnounce] = useState<string | undefined>(undefined);
  const [onAnnounceConfirm, setOnAnnounceConfirm] = useState<
    (() => void) | undefined
  >(undefined);

  const onSubmit = (data: FormValues) => {
    const count = contextPlayers.length;
    const [isEstablished, message] = isGameEstablished(count, data);

    if (!isEstablished) {
      setAnnounce(message);
      setOnAnnounceConfirm(() => () => setAnnounce(undefined));
    } else {
      setCharacters(data); // キャラクターの割り当て設定を保存
      console.log("キャラクターの幅");
      console.log(data);
      // ここで常にプレイヤーを再ランダム化する
      setPlayers(randomCharacters({ players: contextPlayers, data }));
      navigate("/game/local/option");
    }
  };

  return (
    <motion.div
      className="h-[100%] w-[100%]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title title="役職設定" />
      <div className="h-[67%] flex flex-col justify-center items-center w-[100svw]">
        <FormProvider {...methods}>
          <motion.div
            className="w-[66svw] overflow-y-scroll overflow-x-clip"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {characters.map((character) => (
              <CharacterSetting
                key={character.id}
                code={character.code}
                namePrefix={character.code}
              />
            ))}
            {groups.map((group) => (
              <GroupSetting
                key={group.id}
                data={group}
                namePrefix={group.code}
              />
            ))}
          </motion.div>
        </FormProvider>
      </div>

      {announce && (
        <Announce
          text={announce}
          onConfirm={onAnnounceConfirm}
          confirmText="OK"
          showCancel={false}
        />
      )}
      <NavButton
        back={"/game/local/players"}
        next={() => methods.handleSubmit(onSubmit)()}
      />
    </motion.div>
  );
}
