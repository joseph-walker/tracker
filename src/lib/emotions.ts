export const emotions = {
	happiness: {
		high: [
			"elated",
			"giddy",
			"overjoyed",
			"radiant",
			"ecstatic",
			"jubilant"
		],
		medium: [
			"tickled",
			"glowing",
			"excited",
			"joyous",
			"bubbly",
			"delighted"
		],
		low: [
			"amused",
			"cheerful",
			"pleased",
			"relieved",
			"glad",
			"serene"
		]
	},
	sadness: {
		high: [
			"miserable",
			"crushed",
			"worthless",
			"humiliated",
			"depressed",
			"helpless"
		],
		medium: [
			"forlorn",
			"burdened",
			"slighted",
			"abused",
			"defeated",
			"dejected"
		],
		low: [
			"resigned",
			"apathetic",
			"blue",
			"gloomy",
			"ignored",
			"glum"
		]
	},
	anger: {
		high: [
			"fuming",
			"furious",
			"outraged",
			"incensed",
			"burned up",
			"hateful"
		],
		medium: [
			"disgusted",
			"irritated",
			"aggravated",
			"biting",
			"hostile",
			"riled"
		],
		low: [
			"peeved",
			"bugged",
			"annoyed",
			"ruffled",
			"nettled",
			"cross"
		]
	},
	love: {
		high: [
			"adoring",
			"devoted",
			"passionate",
			"amorous",
			"tender",
			"ardent"
		],
		medium: [
			"caring",
			"dedicated",
			"generous",
			"loving",
			"empathic",
			"considerate"
		],
		low: [
			"warm",
			"amiable",
			"civil",
			"polite",
			"giving",
			"kindly"
		]
	},
	fear: {
		high: [
			"dreadful",
			"panicky",
			"horrified",
			"terrified",
			"petrified",
			"desperate"
		],
		medium: [
			"alarmed",
			"fearful",
			"jittery",
			"strained",
			"shaky",
			"threatened"
		],
		low: [
			"uneasy",
			"tense",
			"timid",
			"anxious",
			"nervous",
			"puzzled"
		]
	},
	distress: {
		high: [
			"anguished",
			"disgusted",
			"speechless",
			"tormented",
			"sickened",
			"afflicted"
		],
		medium: [
			"badgered",
			"bewildered",
			"confused",
			"disturbed",
			"impaired",
			"offended"
		],
		low: [
			"silly",
			"foolish",
			"unsure",
			"touchy",
			"lost",
			"disturbed"
		]
	}
} as const;

export type Emotion = (typeof emotions)[keyof typeof emotions][EmotionLevel][number];
export type EmotionGroup = keyof typeof emotions;
export type EmotionLevel = "high" | "medium" | "low";

type InverseLookupMap =
	Record<
		Emotion,
		[EmotionGroup, EmotionLevel]
	>;

const inverseLookupMap = Object.entries(emotions).reduce(function (map, [groupName, emotionGroup]) {
	const addToMap = (level: EmotionLevel) => (emotion: Emotion) => {
		map[emotion] = [groupName as EmotionGroup, level]
	};

	emotionGroup.high.forEach(addToMap("high"));
	emotionGroup.medium.forEach(addToMap("medium"));
	emotionGroup.low.forEach(addToMap("low"));

	return map;
}, {} as InverseLookupMap);

export const emotionGroups = Object.keys(emotions) as EmotionGroup[];

export function getGroupAndLevel(emotion: Emotion) {
	return inverseLookupMap[emotion];
}

export function emotionsForGroup(emotionGroup: EmotionGroup): Emotion[] {
	return Object.values(emotions[emotionGroup]).flat(1);
}

export function reconstructEmotionMap(emotions: Emotion[]): Record<EmotionGroup, Record<EmotionLevel, Emotion[]>> {
	return emotions.reduce(function (cardData, emotion) {
        const [group, level] = getGroupAndLevel(emotion);

        return {
            ...cardData,
            [group]: {
                ...cardData[group],
                [level]: [...cardData[group]?.[level] ?? [], emotion]
            }
        };
    }, {} as Record<EmotionGroup, Record<EmotionLevel, Emotion[]>>);
}
