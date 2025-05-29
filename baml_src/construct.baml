class LLMTuning {
    temperature float @description("Temperature for randomness in generation, 0.0-1.0")
    top_p float @description("Top-p sampling for randomness, 0.0-1.0")
    presence_penalty float @description("Penalty for new topics, -2.0 to 2.0")
    frequency_penalty float @description("Penalty for repeated topics, -2.0 to 2.0")
}


class Archetype {
    archetype_class string @description("The archetype class of the persona, e.g., 'The Hero', 'The Mentor'")
    trope_tags string[] @description("Trope tags, ideally 3-5, e.g., ['Wandering empath', 'Reluctant hero']")
}

class Demographic {
    gender string @description("Gender identity, flexible definition")
    age string @description("Age description, e.g., 'Mid 30s', 'Ageless'")
    race_species string @description("Race or species, e.g., 'Human', 'Android'")
    birthday string? @description("Optional birthday of the persona")
    birthplace string? @description("Optional birthplace of the persona")
    height string? @description("Height description, e.g., '5'7\", 'Tall'")
    weight string? @description("Weight description, optional, e.g., 'Lean'")
}

class Psychographics {
    personality_summary string @description("Brief personality summary, e.g., 'Haunted yet compassionate'")
    core_values string[] @description("Key values, 3-5 recommended")
    fears string[] @description("Main fears, 2-4 recommended")
    desires string[] @description("Core desires, 2-4 recommended")
    beliefs string[] @description("Fundamental beliefs or worldview")
}

class Behavior {
    behavior_arc string @description("Behavior evolution, e.g., 'Guarded → Loyal'")
    refusal_style string @description("How persona initially resists requests")
    trigger_to_help string @description("What motivates persona to help")
    mannerisms string[] @description("Mannerisms, 2-4 recommended")
    quirks string[] @description("Quirks, 2-4 recommended")
}

class VisualProfile {
    body string @description("General body description, e.g., 'Tall, wiry'")
    features string @description("Key features like scars, eyes, skin")
    style string @description("Clothing and accessories description")
    aura string? @description("Optional vibe or presence descriptor")
}

class Voice {
    tone string[] @description("Tone attributes, e.g., ['Soft-spoken', 'Melancholic']")
    speech_style string @description("Speech style, e.g., 'Formal', 'Poetic'")
    pov string @description("Narration style, e.g., 'First person'")
    accent string? @description("Optional accent, e.g., 'British'")
}

class Lore {
    backstory string @description("Detailed origin story or background")
    defining_moments string[] @description("Crucial life-changing events, 2-4 recommended")
}

class LifeStyle {
    occupation string @description("Occupation or role, e.g., 'Bounty Hunter'")
    hobbies string[] @description("Daily or recreational activities persona enjoys, e.g., 'Brewing tea', 'Gardening', 'Sword training'")
    interests string[] @description("Topics or fields persona is drawn to, e.g., 'Philosophy', 'Ancient history', 'Cybernetics'")
    favorite_foods string[] @description("Favorite foods or drinks, e.g., 'Spiced tea', 'Street ramen', 'Synth-whiskey'")
    dislikes string[] @description("Things persona actively dislikes, e.g., 'Loud noises', 'Crowded places', 'Sweet foods'")
    daily_routine string? @description("Brief description of typical day or rituals, optional")
}

class Identity {
    name string @description("Full name of the persona")
    alias string? @description("Alias or nickname")
    role string @description("Primary narrative role of persona")
    tags string[] @description("Searchable tags, ideally 3-5 tags")
}


class Construct {
    identity Identity @description("Identity details")
    archetype Archetype @description("Archetype details")
    demographic Demographic @description("Demographic details")
    psychographics Psychographics @description("Psychographic profile")
    behavior Behavior @description("Behavioral profile")
    visual_profile VisualProfile @description("Visual profile description")
    voice Voice @description("Voice and speech details")
    lore Lore @description("Backstory and lore")
    lifestyle LifeStyle @description("Lifestyle and daily activities")
    llm_tuning LLMTuning @description("LLM tuning parameters")
}



function GenerateConstruct(promptReq: string) -> Construct {
  client Ollama
  prompt #"
    {# start a user message #}
    {{ _.role("user") }}
     
    You are Persona Generator, a tool that creates detailed personas for various narrative purposes.

    Avoid generating any unwanted or unnecessary information. Only focus on the persona generation.
    Please ensure to follow the given structured:
    {{ promptReq }}

    {# end the user message #}
    {{ _.role("persona_generator_v1") }}
    {{ promptReq }}

    {# special macro to print the output schema instructions. #}
    {{ ctx.output_format }}
  "#
}

test ConstructGenerator {
  functions [GenerateConstruct]
  args {
    promptReq "Generate me a traveling cat and dog duo who are best brothers that travel the verse searching for their long lost human dad."
  }
}