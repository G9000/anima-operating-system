import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";

interface SummarizeMessage {
	role: string;
	content: string;
}

interface SummarizeRequestBody {
	messages: SummarizeMessage[];
	construct_id?: string;
	summary_style?: "brief" | "detailed" | "key_points";
	mode?: "system" | "construct";
}

const ANIMA_OS_CORE_URL =
	process.env.NEXT_PUBLIC_ANIMA_OS_CORE_URL || "http://127.0.0.1:8000";

function validateRequestBody(body: any): body is SummarizeRequestBody {
	return (
		body &&
		Array.isArray(body.messages) &&
		body.messages.every(
			(msg: any) =>
				typeof msg.role === "string" && typeof msg.content === "string",
		) &&		(body.construct_id === undefined || typeof body.construct_id === "string") &&
		(body.summary_style === undefined || 
		 body.summary_style === "brief" || 
		 body.summary_style === "detailed" || 
		 body.summary_style === "key_points") &&
		(body.mode === undefined || 
		 body.mode === "system" || 
		 body.mode === "construct")
	);
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		console.log("[Summarize Proxy] Received request body:", body);

		if (!validateRequestBody(body)) {
			return NextResponse.json(
				{ error: "Invalid request body format" },
				{ status: 400 },
			);
		}

		// Get Supabase session for authentication
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

		// Call backend summarization endpoint
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

		const response = await fetch(`${ANIMA_OS_CORE_URL}/v1/chat/summarize`, {
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
			console.error(`Backend summarization error ${response.status}:`, errorText);

			return NextResponse.json(
				{
					error: `Backend error: ${response.statusText}`,
					details: errorText,
				},
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);

	} catch (error) {
		console.error("Summarization proxy error:", error);

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
