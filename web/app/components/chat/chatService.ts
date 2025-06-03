import { Message, ChatMode } from "./types";

export const streamChat = async (
  messages: Array<{ role: string; content: string }>,
  threadId: string,
  personaId: string,
  conversationMode: ChatMode,
  onChunk: (chunk: string) => void
) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({
        model: "gemma3:27b",
        messages: messages,
        temperature: 0.7,
        max_tokens: 0,
        stream: true,
        thread_id: threadId,
        mode: conversationMode,
        construct_id: "b40837f7-f1d3-4339-8fe0-a43e0ad2bf83",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    const processChunkWithDelay = async (chunk: string) => {
      const words = chunk.split(' ');
      for (const word of words) {
        onChunk(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
      }
    };

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                await processChunkWithDelay(content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error streaming chat:", error);
    throw error;
  }
};
