import pool from '../lib/db';

// Helper function to get date with offset
function getDateWithOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

const appointmentsData = [
  {
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    date: getDateWithOffset(1), // Tomorrow
    time: '09:00:00',
    reason: 'Consultation pour divorce à l\'amiable',
    status: 'approved',
    notes: null,
    created_by: 'client',
  },
  {
    name: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    phone: '+33 6 23 45 67 89',
    date: getDateWithOffset(1), // Tomorrow
    time: '14:00:00',
    reason: 'Litige commercial avec un fournisseur',
    status: 'approved',
    notes: 'Client référé par un ancien client',
    created_by: 'admin',
  },
  {
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: null,
    date: getDateWithOffset(2), // Day after tomorrow
    time: '10:00:00',
    reason: 'Question sur la succession de mes parents',
    status: 'pending',
    notes: null,
    created_by: 'client',
  },
  {
    name: 'Jean Lefebvre',
    email: 'jean.lefebvre@email.com',
    phone: '+33 6 45 67 89 01',
    date: getDateWithOffset(3),
    time: '11:00:00',
    reason: 'Création de société SAS',
    status: 'approved',
    notes: 'Rendez-vous confirmé par téléphone',
    created_by: 'admin',
  },
  {
    name: 'Isabelle Moreau',
    email: 'isabelle.moreau@email.com',
    phone: '+33 6 56 78 90 12',
    date: getDateWithOffset(4),
    time: '15:00:00',
    reason: 'Litige locatif - problème avec le propriétaire',
    status: 'approved',
    notes: null,
    created_by: 'client',
  },
  {
    name: 'Thomas Petit',
    email: 'thomas.petit@email.com',
    phone: '+33 6 67 89 01 23',
    date: getDateWithOffset(5),
    time: '09:30:00',
    reason: 'Contrat de travail - licenciement abusif',
    status: 'pending',
    notes: null,
    created_by: 'client',
  },
  {
    name: 'Amélie Roux',
    email: 'amelie.roux@email.com',
    phone: '+33 6 78 90 12 34',
    date: getDateWithOffset(7), // Next week
    time: '14:30:00',
    reason: 'Rédaction de testament',
    status: 'approved',
    notes: 'Cliente régulière',
    created_by: 'admin',
  },
  {
    name: 'Nicolas Laurent',
    email: 'nicolas.laurent@email.com',
    phone: null,
    date: getDateWithOffset(0), // Today
    time: '16:00:00',
    reason: 'Urgence - problème de garde d\'enfants',
    status: 'rejected',
    notes: 'Pas disponible à cette heure',
    created_by: 'client',
  },
];

async function seedAppointments() {
  try {
    console.log('Seeding appointments data...');

    for (const apt of appointmentsData) {
      await pool.query(
        `INSERT INTO appointments (name, email, phone, date, time, reason, status, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [apt.name, apt.email, apt.phone, apt.date, apt.time, apt.reason, apt.status, apt.notes, apt.created_by]
      );
      console.log(`✓ Added: ${apt.name} - ${apt.date} at ${apt.time} (${apt.status})`);
    }

    console.log(`\n✓ Successfully seeded ${appointmentsData.length} appointments`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding appointments:', error);
    process.exit(1);
  }
}

seedAppointments();
