import Anthropic from '@anthropic-ai/sdk';
import { LLMExtractedAction } from '@/types/extraction';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are a legal compliance analyst for the Indian judiciary system. Extract all court-mandated action items from the judgment text provided.

For each action item, return a JSON object with exactly these fields:
{
  "directive": "Exact or paraphrased directive text from the judgment",
  "department": "Responsible government department or ministry (e.g. Ministry of Environment, Ministry of Finance, State Government, etc.)",
  "deadline_raw": "Deadline as stated in the judgment text (e.g. '90 days', '6 months', 'next budget session')",
  "deadline_iso": "ISO 8601 date estimate based on judgment date (YYYY-MM-DD format, estimate from context)",
  "metric": "How compliance should be measured or verified",
  "source_text": "Exact quoted text from the judgment that contains this directive",
  "source_page": 1,
  "confidence": 0.0,
  "priority": "high"
}

Rules:
- Return ONLY a valid JSON array, no markdown, no explanation
- confidence must be a float between 0 and 1 (1 = very clear directive, 0 = ambiguous)
- priority must be "high", "medium", or "low"
- Be exhaustive — courts expect FULL compliance; do not omit any directive
- If no deadline is mentioned, use "not specified" for deadline_raw and null for deadline_iso
- If no department is mentioned, infer from context`;

export async function extractActionsFromText(
  text: string,
  judgmentDate: string,
  onChunk?: (partial: string) => void
): Promise<LLMExtractedAction[]> {
  const userMessage = `Judgment Date: ${judgmentDate}

Judgment Text:
${text.slice(0, 80000)}`; // Claude's context window limit safety

  if (onChunk) {
    // Streaming mode
    let fullText = '';
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        fullText += event.delta.text;
        onChunk(event.delta.text);
      }
    }

    return parseExtractedActions(fullText);
  } else {
    // Non-streaming mode
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text_content = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('');

    return parseExtractedActions(text_content);
  }
}

function parseExtractedActions(text: string): LLMExtractedAction[] {
  try {
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: Record<string, unknown>) => ({
      directive: String(item.directive || ''),
      department: String(item.department || 'General'),
      deadline_raw: String(item.deadline_raw || 'not specified'),
      deadline_iso: (item.deadline_iso as string) || '',
      metric: String(item.metric || ''),
      source_text: String(item.source_text || ''),
      source_page: Number(item.source_page) || 1,
      confidence: Math.min(1, Math.max(0, Number(item.confidence) || 0.5)),
      priority: (['high', 'medium', 'low'].includes(String(item.priority))
        ? String(item.priority)
        : 'medium') as 'high' | 'medium' | 'low',
    }));
  } catch {
    return [];
  }
}
