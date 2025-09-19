
export interface StoryboardItem {
  id: number;
  imagePrompt: string;
  voiceoverScript: string;
  imageBase64: string | null;
}

export interface StoryPlanItem {
  image_prompt: string;
  voiceover_script: string;
}

export interface StoryPlan {
  character_sheet_prompt: string;
  scenes: StoryPlanItem[];
}
