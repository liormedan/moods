import { NextRequest, NextResponse } from 'next/server';

interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  notes?: string;
  cost: number;
}

// Generate demo appointments
function generateAppointments(): Appointment[] {
  const now = new Date();
  const appointments: Appointment[] = [];

  // Upcoming appointments
  appointments.push({
    id: 'apt-1',
    therapistId: 'therapist-1',
    therapistName: 'ד"ר שרה כהן',
    date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    notes: 'המשך עבודה על טכניקות התמודדות עם חרדה',
    cost: 350
  });

  appointments.push({
    id: 'apt-2',
    therapistId: 'therapist-1',
    therapistName: 'ד"ר שרה כהן',
    date: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '15:30',
    duration: 50,
    type: 'video',
    status: 'scheduled',
    cost: 350
  });

  // Past appointments
  appointments.push({
    id: 'apt-3',
    therapistId: 'therapist-1',
    therapistName: 'ד"ר שרה כהן',
    date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    duration: 50,
    type: 'video',
    status: 'completed',
    notes: 'סיכום: התקדמות טובה בטכניקות נשימה. המטופל מדווח על שיפור במצב הרוח.',
    cost: 350
  });

  appointments.push({
    id: 'apt-4',
    therapistId: 'therapist-1',
    therapistName: 'ד"ר שרה כהן',
    date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '16:00',
    duration: 50,
    type: 'video',
    status: 'completed',
    notes: 'פגישה ראשונה - הכרות והערכה ראשונית. הוגדרו יעדי טיפול.',
    cost: 350
  });

  appointments.push({
    id: 'apt-5',
    therapistId: 'therapist-2',
    therapistName: 'פרופ׳ דוד לוי',
    date: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    duration: 45,
    type: 'in-person',
    status: 'pending',
    notes: 'בדיקת התאמת תרופות',
    cost: 450
  });

  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// GET /api/therapists/appointments - Get user appointments
export async function GET() {
  try {
    const appointments = generateAppointments();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      data: appointments,
      metadata: {
        total: appointments.length,
        upcoming: appointments.filter(a => new Date(a.date) > new Date()).length,
        completed: appointments.filter(a => a.status === 'completed').length,
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        pending: appointments.filter(a => a.status === 'pending').length,
        totalCost: appointments.reduce((sum, a) => sum + a.cost, 0),
        byType: appointments.reduce((acc, a) => {
          acc[a.type] = (acc[a.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      message: 'Appointments loaded successfully'
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load appointments',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/therapists/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      therapistId: body.therapistId || 'therapist-1',
      therapistName: body.therapistName || 'מטפל',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '16:00',
      duration: body.duration || 50,
      type: body.type || 'video',
      status: 'pending',
      notes: body.notes,
      cost: body.cost || 350
    };

    console.log('New appointment created:', newAppointment);

    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create appointment',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}