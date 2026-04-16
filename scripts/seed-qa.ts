import pool from '../lib/db';

const qaData = [
  {
    question: "Quels sont les honoraires d'un avocat en droit de la famille ?",
    answer: "Les honoraires varient selon la complexité du dossier. Nous proposons un premier rendez-vous gratuit pour évaluer vos besoins et établir un devis personnalisé. Nos tarifs sont transparents et peuvent être adaptés selon votre situation.",
    category: "Droit de la famille",
    display_order: 1,
    published: true,
  },
  {
    question: "Combien de temps dure une procédure de divorce ?",
    answer: "La durée d'une procédure de divorce dépend du type de divorce choisi. Un divorce par consentement mutuel peut être finalisé en 2 à 3 mois, tandis qu'un divorce contentieux peut prendre de 12 à 24 mois selon la complexité du dossier et l'encombrement du tribunal.",
    category: "Droit de la famille",
    display_order: 2,
    published: true,
  },
  {
    question: "Comment protéger mon patrimoine en cas de divorce ?",
    answer: "Il existe plusieurs mécanismes pour protéger votre patrimoine : contrat de mariage, donation entre époux, trust, etc. Notre cabinet vous conseille sur les meilleures stratégies selon votre situation personnelle et familiale.",
    category: "Droit de la famille",
    display_order: 3,
    published: true,
  },
  {
    question: "Quelles sont les étapes pour créer une société ?",
    answer: "La création d'une société comprend plusieurs étapes : choix de la forme juridique (SARL, SAS, SA...), rédaction des statuts, dépôt du capital social, publication d'une annonce légale, et immatriculation au registre du commerce. Notre cabinet vous accompagne à chaque étape du processus.",
    category: "Droit commercial",
    display_order: 4,
    published: true,
  },
  {
    question: "Qu'est-ce qu'un litige commercial et comment le résoudre ?",
    answer: "Un litige commercial est un conflit entre professionnels concernant leurs activités commerciales. Il peut être résolu par la négociation, la médiation, l'arbitrage ou une action en justice. Nous privilégions toujours les solutions amiables avant d'engager une procédure judiciaire.",
    category: "Droit commercial",
    display_order: 5,
    published: true,
  },
  {
    question: "Comment rédiger un contrat commercial solide ?",
    answer: "Un contrat commercial doit être clair, précis et équilibré. Il doit définir les obligations de chaque partie, les modalités de paiement, les garanties, les clauses de responsabilité et les conditions de résiliation. Notre cabinet vous aide à rédiger des contrats sécurisés et adaptés à votre activité.",
    category: "Droit commercial",
    display_order: 6,
    published: true,
  },
  {
    question: "Ai-je besoin d'un avocat pour un litige locatif ?",
    answer: "Bien que non obligatoire, un avocat est fortement recommandé pour défendre vos intérêts dans un litige locatif. Il connaît vos droits, peut négocier avec la partie adverse et représenter vos intérêts devant le tribunal si nécessaire.",
    category: "Droit immobilier",
    display_order: 7,
    published: true,
  },
  {
    question: "Comment contester un testament ?",
    answer: "Un testament peut être contesté pour plusieurs raisons : vice de forme, altération des facultés mentales du testateur, captation d'héritage, etc. La contestation doit être faite dans un délai de 5 ans à compter du décès. Notre cabinet vous accompagne dans cette procédure délicate.",
    category: "Droit des successions",
    display_order: 8,
    published: true,
  },
];

async function seedQA() {
  try {
    console.log('Seeding Q&A data...');

    for (const qa of qaData) {
      await pool.query(
        `INSERT INTO qa (question, answer, category, display_order, published)
         VALUES ($1, $2, $3, $4, $5)`,
        [qa.question, qa.answer, qa.category, qa.display_order, qa.published]
      );
      console.log(`✓ Added: ${qa.question.substring(0, 50)}...`);
    }

    console.log(`\n✓ Successfully seeded ${qaData.length} Q&A items`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Q&A:', error);
    process.exit(1);
  }
}

seedQA();
