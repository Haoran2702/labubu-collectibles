import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const body = await request.json();
    const { items, total, shippingInfo, reason } = body;
    const { id } = await params;

    const response = await fetch(`http://localhost:3001/api/orders/${id}/modify`, {
      method: 'PATCH',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        total,
        shippingInfo,
        reason
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error modifying order:', error);
    return NextResponse.json(
      { error: 'Failed to modify order' },
      { status: 500 }
    );
  }
} 