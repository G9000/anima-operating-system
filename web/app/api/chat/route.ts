import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

interface ChatMessage {
	role: string;
	content: string;
	name?: string;
}

interface ChatRequestBody {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	max_tokens?: number;
	stream?: boolean;
	thread_id?: string;
	conversation_mode?: string;
	persona_id?: string;
}

const ANIMA_OS_CORE_URL =
	process.env.NEXT_PUBLIC_ANIMA_OS_CORE_URL || "http://127.0.0.1:8000";

function validateRequestBody(body: any): body is ChatRequestBody {
	return (
		body &&
		typeof body.model === "string" &&
		Array.isArray(body.messages) &&
		body.messages.every(
			(msg: any) =>
				typeof msg.role === "string" && typeof msg.content === "string",
		)
	);
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!validateRequestBody(body)) {
			return NextResponse.json(
				{ error: "Invalid request body format" },
				{ status: 400 },
			);
		}

		const supabaseClient = await createClient();
		const {
			data: { session },
			error: authError,
		} = await supabaseClient.auth.getSession();

		if (authError) {
			console.error("Auth error:", authError);
			return NextResponse.json(
				{ error: "Authentication failed" },
				{ status: 401 },
			);
		}

		const accessToken = session?.access_token;
		if (!accessToken) {
			return NextResponse.json(
				{ error: "Unauthorized: No access token found" },
				{ status: 401 },
			);
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

		const response = await fetch(`${ANIMA_OS_CORE_URL}/v1/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
				accept: "*/*",
			},
			body: JSON.stringify(body),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);


		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Backend error ${response.status}:`, errorText);

			return NextResponse.json(
				{
					error: `Backend error: ${response.statusText}`,
					details: errorText,
				},
				{ status: response.status },
			);
		}
		if (!body.stream) {
			const data = await response.json();
			return NextResponse.json(data);
		}

		if (!response.body) {
			return NextResponse.json(
				{ error: "No response body available for streaming" },
				{ status: 500 },
			);
		}

		const reader = response.body.getReader();
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();

		const stream = new TransformStream({
			async transform(chunk, controller) {
				controller.enqueue(chunk);
			},
			async flush(controller) {
				controller.enqueue(encoder.encode("data: [DONE]\n\n"));
			},
		});

		const writer = stream.writable.getWriter();

		const pump = async (): Promise<void> => {
			try {
				while (true) {
					const { done, value } = await reader.read();

					if (done) {
						await writer.close();
						break;
					}

					if (process.env.NODE_ENV === "development") {
						const chunk = decoder.decode(value, { stream: true });
						console.log("[Proxy] Chunk:", `${chunk.substring(0, 100)}...`);
					}

					await writer.write(value);
				}
			} catch (error) {
				console.error("Stream pump error:", error);
				await writer.abort(error);
			}
		};

		pump();

		return new NextResponse(stream.readable, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
				"X-Accel-Buffering": "no",
				"Transfer-Encoding": "chunked",
			},
		});
	} catch (error) {
		console.error("Proxy error:", error);

		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: "Invalid JSON in request body" },
				{ status: 400 },
			);
		}

		if (error instanceof TypeError && error.message.includes("fetch")) {
			return NextResponse.json(
				{ error: "Backend service unavailable" },
				{ status: 503 },
			);
		}

		if (
			error &&
			typeof error === "object" &&
			"name" in error &&
			error.name === "AbortError"
		) {
			return NextResponse.json({ error: "Request timeout" }, { status: 504 });
		}

		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

// Optional: Add OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest) {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}
