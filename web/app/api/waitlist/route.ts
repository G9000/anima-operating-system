import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || 'Emails';

    if (!airtableApiKey || !airtableBaseId) {
      console.error('Missing Airtable configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }


    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${airtableApiKey}`,
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          fields: {
            'Email Address': email,
            'Date Added': new Date().toISOString().split('T')[0], 
            'Subscription Status': 'Subscribed',
          },
        }),
      }
    );

    if (!airtableResponse.ok) {
      const error = await airtableResponse.text();
      console.error('Airtable API error:', error);
      return NextResponse.json(
        { error: 'Failed to save email to waitlist' },
        { status: 500 }
      );
    }

    const airtableData = await airtableResponse.json();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        recordId: airtableData.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
