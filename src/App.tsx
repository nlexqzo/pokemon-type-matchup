import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import './App.css';
import TypeCard from './components/TypeCard';

type PokemonType =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';

type TypeMeta = {
  name: PokemonType;
  jp: string;
  cn: string;
  color: string;
  icon: string;
};

type EffectivenessEntry = {
  strong: PokemonType[];
  weak: PokemonType[];
  immune: PokemonType[];
};

type MatchupResult = {
  quadrupleEffective: PokemonType[];
  superEffective: PokemonType[];
  neutral: PokemonType[];
  notVeryEffective: PokemonType[];
  quarterEffective: PokemonType[];
  noEffect: PokemonType[];
};

type MatchupSectionProps = {
  title: string;
  cn: string;
  jp: string;
  types: PokemonType[];
  typeMap: Record<PokemonType, TypeMeta>;
  emphasisClassName?: string;
  columnsClassName?: string;
  animateItems?: boolean;
};

const types: TypeMeta[] = [
  { name: 'Normal', jp: 'ノーマル', cn: '一般', color: 'bg-zinc-400 text-white', icon: '/type-icons/normal.svg' },
  { name: 'Fire', jp: 'ほのお', cn: '火', color: 'bg-red-500 text-white', icon: '/type-icons/fire.svg' },
  { name: 'Water', jp: 'みず', cn: '水', color: 'bg-blue-500 text-white', icon: '/type-icons/water.svg' },
  { name: 'Grass', jp: 'くさ', cn: '草', color: 'bg-green-500 text-white', icon: '/type-icons/grass.svg' },
  { name: 'Electric', jp: 'でんき', cn: '电', color: 'bg-yellow-400 text-black', icon: '/type-icons/electric.svg' },
  { name: 'Ice', jp: 'こおり', cn: '冰', color: 'bg-cyan-300 text-black', icon: '/type-icons/ice.svg' },
  {
    name: 'Fighting',
    jp: 'かくとう',
    cn: '格斗',
    color: 'bg-orange-700 text-white',
    icon: '/type-icons/fighting.svg'
  },
  { name: 'Poison', jp: 'どく', cn: '毒', color: 'bg-purple-500 text-white', icon: '/type-icons/poison.svg' },
  { name: 'Ground', jp: 'じめん', cn: '地面', color: 'bg-amber-600 text-white', icon: '/type-icons/ground.svg' },
  { name: 'Flying', jp: 'ひこう', cn: '飞行', color: 'bg-indigo-300 text-black', icon: '/type-icons/flying.svg' },
  { name: 'Psychic', jp: 'エスパー', cn: '超能力', color: 'bg-pink-500 text-white', icon: '/type-icons/psychic.svg' },
  { name: 'Bug', jp: 'むし', cn: '虫', color: 'bg-lime-500 text-black', icon: '/type-icons/bug.svg' },
  { name: 'Rock', jp: 'いわ', cn: '岩石', color: 'bg-yellow-700 text-white', icon: '/type-icons/rock.svg' },
  { name: 'Ghost', jp: 'ゴースト', cn: '幽灵', color: 'bg-violet-700 text-white', icon: '/type-icons/ghost.svg' },
  { name: 'Dragon', jp: 'ドラゴン', cn: '龙', color: 'bg-indigo-600 text-white', icon: '/type-icons/dragon.svg' },
  { name: 'Dark', jp: 'あく', cn: '恶', color: 'bg-neutral-800 text-white', icon: '/type-icons/dark.svg' },
  { name: 'Steel', jp: 'はがね', cn: '钢', color: 'bg-slate-400 text-black', icon: '/type-icons/steel.svg' },
  { name: 'Fairy', jp: 'フェアリー', cn: '妖精', color: 'bg-pink-300 text-black', icon: '/type-icons/fairy.svg' }
];

const typeMap = Object.fromEntries(types.map((type) => [type.name, type])) as Record<PokemonType, TypeMeta>;

const effectiveness: Record<PokemonType, EffectivenessEntry> = {
  Normal: {
    strong: [],
    weak: ['Rock', 'Steel'],
    immune: ['Ghost']
  },
  Fire: {
    strong: ['Grass', 'Ice', 'Bug', 'Steel'],
    weak: ['Fire', 'Water', 'Rock', 'Dragon'],
    immune: []
  },
  Water: {
    strong: ['Fire', 'Ground', 'Rock'],
    weak: ['Water', 'Grass', 'Dragon'],
    immune: []
  },
  Grass: {
    strong: ['Water', 'Ground', 'Rock'],
    weak: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'],
    immune: []
  },
  Electric: {
    strong: ['Water', 'Flying'],
    weak: ['Electric', 'Grass', 'Dragon'],
    immune: ['Ground']
  },
  Ice: {
    strong: ['Grass', 'Ground', 'Flying', 'Dragon'],
    weak: ['Fire', 'Water', 'Ice', 'Steel'],
    immune: []
  },
  Fighting: {
    strong: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'],
    weak: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'],
    immune: ['Ghost']
  },
  Poison: {
    strong: ['Grass', 'Fairy'],
    weak: ['Poison', 'Ground', 'Rock', 'Ghost'],
    immune: ['Steel']
  },
  Ground: {
    strong: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
    weak: ['Grass', 'Bug'],
    immune: ['Flying']
  },
  Flying: {
    strong: ['Grass', 'Fighting', 'Bug'],
    weak: ['Electric', 'Rock', 'Steel'],
    immune: []
  },
  Psychic: {
    strong: ['Fighting', 'Poison'],
    weak: ['Psychic', 'Steel'],
    immune: ['Dark']
  },
  Bug: {
    strong: ['Grass', 'Psychic', 'Dark'],
    weak: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'],
    immune: []
  },
  Rock: {
    strong: ['Fire', 'Ice', 'Flying', 'Bug'],
    weak: ['Fighting', 'Ground', 'Steel'],
    immune: []
  },
  Ghost: {
    strong: ['Psychic', 'Ghost'],
    weak: ['Dark'],
    immune: ['Normal']
  },
  Dragon: {
    strong: ['Dragon'],
    weak: ['Steel'],
    immune: ['Fairy']
  },
  Dark: {
    strong: ['Psychic', 'Ghost'],
    weak: ['Fighting', 'Dark', 'Fairy'],
    immune: []
  },
  Steel: {
    strong: ['Ice', 'Rock', 'Fairy'],
    weak: ['Fire', 'Water', 'Electric', 'Steel'],
    immune: []
  },
  Fairy: {
    strong: ['Fighting', 'Dragon', 'Dark'],
    weak: ['Fire', 'Poison', 'Steel'],
    immune: []
  }
};

function getMultiplier(attackType: PokemonType, defenders: PokemonType[]) {
  const data = effectiveness[attackType];

  return defenders.reduce((multiplier, defender) => {
    if (data.immune.includes(defender)) return 0;
    if (data.strong.includes(defender)) return multiplier * 2;
    if (data.weak.includes(defender)) return multiplier * 0.5;
    return multiplier;
  }, 1);
}

function getMatchup(defenders: PokemonType[]): MatchupResult {
  const quadrupleEffective: PokemonType[] = [];
  const superEffective: PokemonType[] = [];
  const neutral: PokemonType[] = [];
  const notVeryEffective: PokemonType[] = [];
  const quarterEffective: PokemonType[] = [];
  const noEffect: PokemonType[] = [];

  (Object.keys(effectiveness) as PokemonType[]).forEach((attackType) => {
    const multiplier = getMultiplier(attackType, defenders);

    if (multiplier === 0) {
      noEffect.push(attackType);
    } else if (multiplier === 4) {
      quadrupleEffective.push(attackType);
    } else if (multiplier === 2) {
      superEffective.push(attackType);
    } else if (multiplier === 1) {
      neutral.push(attackType);
    } else if (multiplier === 0.5) {
      notVeryEffective.push(attackType);
    } else if (multiplier === 0.25) {
      quarterEffective.push(attackType);
    }
  });

  return {
    quadrupleEffective,
    superEffective,
    neutral,
    notVeryEffective,
    quarterEffective,
    noEffect
  };
}

function MatchupSection({
  title,
  cn,
  jp,
  types,
  typeMap,
  emphasisClassName = '',
  columnsClassName = 'grid-cols-2 md:grid-cols-3',
  animateItems = false
}: MatchupSectionProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-white !text-2xl !font-extrabold">{title}</h2>
        <p className="flex flex-col items-start">
          <span>{cn}</span>
          <span>{jp}</span>
        </p>
      </div>

      <ul className={`grid w-full gap-4 ${columnsClassName}`}>
        {types.length > 0 ? (
          animateItems ? (
            <AnimatePresence mode="popLayout">
              {types.map((type) => {
                const currentType = typeMap[type];
                return (
                  <motion.li
                    layout
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="h-full"
                  >
                    <TypeCard
                      name={currentType.name}
                      jp={currentType.jp}
                      cn={currentType.cn}
                      color={currentType.color}
                      icon={currentType.icon}
                      className={`h-full w-full ${emphasisClassName}`.trim()}
                    />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          ) : (
            types.map((type) => {
              const currentType = typeMap[type];
              return (
                <li key={type} className="h-full">
                  <TypeCard
                    name={currentType.name}
                    jp={currentType.jp}
                    cn={currentType.cn}
                    color={currentType.color}
                    icon={currentType.icon}
                    className={`h-full w-full ${emphasisClassName}`.trim()}
                  />
                </li>
              );
            })
          )
        ) : (
          <li className="col-span-full flex h-full w-full flex-col justify-center rounded-xl p-4 opacity-40">
            <div className="flex flex-col">
              <span>No matchups here.</span>
              <span className="text-xs opacity-50">没有匹配。</span>
              <span className="text-xs opacity-50">なし</span>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

function App() {
  const [opponentTypes, setOpponentTypes] = useState<PokemonType[]>([]);
  const outcomeSectionRef = useRef<HTMLElement | null>(null);

  const handleSelectOpponentType = (typeName: PokemonType) => {
    setOpponentTypes((prev) => {
      if (prev.includes(typeName)) {
        return prev.filter((type) => type !== typeName);
      }

      if (prev.length === 2) {
        return [prev[1], typeName];
      }

      return [...prev, typeName];
    });

    if (window.innerWidth < 768) {
      setTimeout(() => {
        outcomeSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  };

  const matchup = opponentTypes.length > 0 ? getMatchup(opponentTypes) : null;

  return (
    <>
      <main className="flex flex-col gap-8 p-8 text-start">
        <header>
          <h1 className="!text-6xl !font-black">
            <span className="[webkit-text-stroke:4px_red]">Pokémon</span> Type Matchup
          </h1>
          <p className="flex flex-col">
            <span>宝可梦类型相性诊断</span>
            <span>ポケモンタイプ相性診断</span>
          </p>
        </header>

        <div className="flex flex-col gap-8 md:flex-row">
          <section className="flex h-fit flex-1 flex-col items-start gap-6 rounded-2xl outline-4 p-8">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col items-start flex-1">
                <h2 className="!text-2xl !font-extrabold">Opponent&apos;s Type</h2>
                <p className="flex flex-col items-start">
                  <span>请选择最多两个对方的类型。</span>
                  <span>相手のタイプを2つまで選んでください。</span>
                </p>
              </div>

              <div className="flex w-full flex-col gap-6 rounded-2xl p-6 outline-2">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-1 flex-col">
                    <h3 className="font-bold text-black dark:text-white">Selected Types</h3>
                    <span>选定的类型</span>
                    <span>選んでいるタイプ</span>
                  </div>
                  <button
                    onClick={() => setOpponentTypes([])}
                    className="dark:text-black text-white dark:bg-white bg-black hover:scale-105 transition-transform rounded-full px-4 py-2 h-fit w-fit"
                  >
                    Reset
                  </button>
                </div>

                <ul
                  className={`grid w-full flex-1 gap-6 ${
                    opponentTypes.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-2'
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {opponentTypes.length > 0 ? (
                      opponentTypes.map((type) => {
                        const currentType = typeMap[type];
                        return (
                          <motion.li
                            layout
                            key={type}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`h-full ${opponentTypes.length === 1 ? 'w-1/2' : 'w-full'}`}
                          >
                            <TypeCard
                              name={currentType.name}
                              jp={currentType.jp}
                              cn={currentType.cn}
                              color={currentType.color}
                              icon={currentType.icon}
                              className="h-full w-full outline-4"
                            />
                          </motion.li>
                        );
                      })
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-1 opacity-50"
                      >
                        <span className="text-xs dark:text-white text-black">Select up to 2 types</span>
                        <div className="flex flex-col">
                          <span className="text-xs">最多选择2种类型</span>
                          <span className="text-xs">2個までタイプを選択してください</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ul>
              </div>
            </div>

            <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
              {types.map((type) => (
                <li key={type.name} className="h-full">
                  <TypeCard
                    name={type.name}
                    jp={type.jp}
                    cn={type.cn}
                    color={type.color}
                    icon={type.icon}
                    onClick={() => handleSelectOpponentType(type.name)}
                    isSelected={opponentTypes.includes(type.name)}
                    className={`${opponentTypes.length > 0 && !opponentTypes.includes(type.name) ? 'opacity-40' : 'opacity-100'}`}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section
            ref={outcomeSectionRef}
            className={`flex flex-1 flex-col items-start gap-10 rounded-2xl outline-4 p-8 ${!matchup ? 'opacity-30' : ''}`}
          >
            <MatchupSection
              title="Ultra Effective (4x)"
              cn="效果绝佳（4倍）"
              jp="効果はばつぐん！（4倍）"
              types={matchup?.quadrupleEffective ?? []}
              typeMap={typeMap}
              emphasisClassName="ring-4 ring-black dark:ring-white"
              animateItems
            />

            <MatchupSection
              title="Super Effective (2x)"
              cn="超级有效（2倍）"
              jp="効果はばつぐん！（2倍）"
              types={matchup?.superEffective ?? []}
              typeMap={typeMap}
              emphasisClassName="ring-4 ring-black dark:ring-white"
              animateItems
            />

            <MatchupSection
              title="Neutral (1x)"
              cn="通常的（1倍）"
              jp="効果はふつう（1倍）"
              types={matchup?.neutral ?? []}
              typeMap={typeMap}
            />

            <MatchupSection
              title="Not Very Effective (0.5x)"
              cn="不是很有效（0.5倍）"
              jp="効果はいまひとつ（0.5倍）"
              types={matchup?.notVeryEffective ?? []}
              typeMap={typeMap}
            />

            <MatchupSection
              title="Barely Effective (0.25x)"
              cn="不是很有效（0.25倍）"
              jp="効果はいまひとつ（0.25倍）"
              types={matchup?.quarterEffective ?? []}
              typeMap={typeMap}
            />

            <MatchupSection
              title="No Effect (0x)"
              cn="没有效果（0倍）"
              jp="効果がない（0倍）"
              types={matchup?.noEffect ?? []}
              typeMap={typeMap}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
