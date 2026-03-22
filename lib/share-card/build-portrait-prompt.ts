type PromptInput = {
  zodiac?: string;
  archetype?: string;
  traits?: Record<string, unknown> | null;
  traitPoints?: Record<string, number> | null;
  gender?: string | null;
};

function getDominantTrait(traitPoints?: Record<string, number> | null) {
  if (!traitPoints) return null;

  const entries = Object.entries(traitPoints).map(([key, value]) => [
    key,
    Number(value) || 0,
  ]) as [string, number][];

  entries.sort((a, b) => b[1] - a[1]);

  return entries[0]?.[0] || null;
}

function getZodiacIdentity(zodiac?: string) {
  const styles: Record<string, string> = {
    Aries:
      "Aries zodiac identity, fiery warrior, crimson and molten gold palette, blazing aura, aggressive heroic presence",
    Taurus:
      "Taurus zodiac identity, earth guardian, stone and gold armor, grounded strength, bull-inspired motifs",
    Gemini:
      "Gemini zodiac identity, duality trickster, teal and silver palette, agile silhouette, mirrored mystical energy",
    Cancer:
      "Cancer zodiac identity, lunar protector, moonlit armor, silver-blue palette, calm defensive aura",
    Leo:
      "Leo zodiac identity, solar king, radiant gold and amber palette, regal armor, dominant heroic stance",
    Virgo:
      "Virgo zodiac identity, rune strategist, emerald and ivory palette, refined armor, precise mystical order",
    Libra:
      "Libra zodiac identity, elegant duelist, silver and purple palette, balanced refined armor, graceful poised stance",
    Scorpio:
      "Scorpio zodiac identity, venom assassin, crimson and black palette, shadow energy, deadly precise elegance",
    Sagittarius:
      "Sagittarius zodiac identity, star hunter, cosmic archer styling, blue and gold palette, adventurous celestial energy",
    Capricorn:
      "Capricorn zodiac identity, mountain warlord, navy steel and frost-blue palette, disciplined commander, heavy refined armor",
    Aquarius:
      "Aquarius zodiac identity, storm visionary, electric blue and violet palette, futuristic mystical energy, lightning currents",
    Pisces:
      "Pisces zodiac identity, abyss mystic, aqua and deep blue palette, dreamlike astral water aura, ethereal elegance",
  };

  return styles[zodiac || ""] || "cosmic fantasy zodiac warrior identity";
}

function getArchetypeIdentity(archetype?: string) {
  const styles: Record<string, string> = {
    Angel:
      "celestial fighter styling, radiant elegance, divine armor details",
    Assassin:
      "sleek stealth styling, sharp silhouette, agile deadly posture",
    Guardian:
      "defensive knight styling, sturdy armor, protective presence",
    Duelist:
      "refined bladesman styling, agile balanced posture, elegant weapon feel",
    Mage:
      "arcane mystic styling, magical aura, refined spellcaster details",
    Warlord:
      "commanding battle leader styling, regal heavy armor, dominant stance",
    Sentinel:
      "shield-bearing elite protector styling, fortress-like defensive look",
    "Shadow Duelist":
      "dark elegant blade fighter styling, mysterious aura, swift deadly poise",
  };

  return styles[archetype || ""] || "premium fantasy fighter styling";
}

function getTraitEmphasis(dominantTrait?: string | null) {
  const styles: Record<string, string> = {
    aggression:
      "intense eyes, stronger aura, sharper pose, offensive visual energy",
    resilience:
      "heavier armor, durable silhouette, defensive power emphasis",
    mystique:
      "mystical glow, astral runes, enigmatic expression, magical atmosphere",
    precision:
      "clean lines, refined weapon details, focused composed expression",
    instinct:
      "alert dynamic stance, natural combat flow, heightened awareness",
  };

  return styles[(dominantTrait || "").toLowerCase()] || "clean premium fantasy presence";
}

function getGenderIdentity(gender?: string | null) {
  if (gender?.toLowerCase() === "male") {
    return [
      "adult male anime fantasy warrior",
      "single male character",
      "masculine face",
      "strong jawline",
      "broad shoulders",
      "male body proportions",
      "no feminine features",
      "not female",
      "not woman",
      "not girl",
    ].join(", ");
  }

  if (gender?.toLowerCase() === "female") {
    return [
      "adult female anime fantasy warrior",
      "single female character",
      "feminine face",
      "elegant female fighter",
      "female body proportions",
      "not male",
      "not man",
      "not boy",
    ].join(", ");
  }

  return "single anime fantasy warrior character";
}

export function buildPortraitPrompt(input: PromptInput) {
  const dominantTrait = getDominantTrait(input.traitPoints);

  return [
  getGenderIdentity(input.gender),
  `character gender must clearly read as ${input.gender || "unknown"}`,
  getZodiacIdentity(input.zodiac),
  getArchetypeIdentity(input.archetype),
  getTraitEmphasis(dominantTrait),
  "premium mobile game character portrait",
  "anime fantasy art style",
  "high detail face and armor",
  "centered single character composition",
  "clean background with soft aura",
  "waist-up hero portrait",
  "no text, no watermark, no logo, no extra characters",
].join(", ");
}