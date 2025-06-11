import { WorshipPlace } from '../types';

export const worshipPlaces: WorshipPlace[] = [
  {
    id: '1',
    name: 'Cathédrale Saint-Étienne de Metz',
    denomination: 'Catholic',
    address: 'Place d\'Armes',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 8h30, 10h00, 11h30; Samedi: 18h00',
    contactInfo: 'Tel: 03 87 36 12 01, Email: cathedrale@catholique-metz.fr',
    website: 'https://cathedrale-metz.fr',
    position: [49.1194, 6.1757]
  },
  {
    id: '2',
    name: 'Église Saint-Maximin',
    denomination: 'Catholic',
    address: '61 Rue Mazelle',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h30; Mercredi et Vendredi: 18h30',
    contactInfo: 'Tel: 03 87 68 02 30',
    position: [49.1153, 6.1823]
  },
  {
    id: '3',
    name: 'Temple Neuf',
    denomination: 'Protestant',
    address: 'Place de la Comédie',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h00',
    contactInfo: 'Tel: 03 87 30 42 10, Email: templeneuf.metz@gmail.com',
    website: 'https://templeneuf.fr',
    position: [49.1197, 6.1705]
  },
  {
    id: '4',
    name: 'Église Orthodoxe Saint-Nicolas',
    denomination: 'Orthodox',
    address: '6 Rue du Charron',
    postalCode: '57070',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h00; Samedi: 18h00',
    contactInfo: 'Tel: 03 87 51 85 55',
    position: [49.1295, 6.1584]
  },
  {
    id: '5',
    name: 'Église Évangélique de Pentecôte',
    denomination: 'Evangelical',
    address: '47 Rue du XXe Corps Américain',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 9h30; Mardi: 19h30 (étude biblique)',
    contactInfo: 'Tel: 03 87 66 31 60',
    website: 'https://addmetz.fr',
    position: [49.1226, 6.1686]
  },
  {
    id: '6',
    name: 'Basilique Saint-Vincent',
    denomination: 'Catholic',
    address: 'Place Saint-Vincent',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 9h00, 11h00; Samedi: 18h30',
    contactInfo: 'Tel: 03 87 36 89 25',
    position: [49.1243, 6.1752]
  },
  {
    id: '7',
    name: 'Temple Protestant de Montigny-lès-Metz',
    denomination: 'Protestant',
    address: '89 Rue du Général Franiatte',
    postalCode: '57950',
    city: 'Montigny-lès-Metz',
    serviceTimes: 'Dimanche: 10h30',
    contactInfo: 'Tel: 03 87 63 41 76',
    position: [49.1048, 6.1460]
  },
  {
    id: '8',
    name: 'Église Orthodoxe Roumaine Sainte Parascève',
    denomination: 'Orthodox',
    address: '20 Rue Rochambeau',
    postalCode: '57070',
    city: 'Metz',
    serviceTimes: 'Dimanche: 9h30',
    contactInfo: 'Tel: 07 69 32 95 25',
    position: [49.1139, 6.1599]
  },
  {
    id: '9',
    name: 'Église Évangélique Méthodiste',
    denomination: 'Evangelical',
    address: '2 Rue Charles Abel',
    postalCode: '57000',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h00; Jeudi: 19h00 (étude biblique)',
    contactInfo: 'Tel: 03 87 63 13 56, Email: contact@eglise-methodiste-metz.fr',
    website: 'https://ueem.org/communautes/eglise-evangelique-methodiste-de-metz',
    position: [49.1122, 6.1808]
  },
  {
    id: '10',
    name: 'Chapelle Sainte-Anne',
    denomination: 'Catholic',
    address: '15 Rue de Verdun',
    postalCode: '57160',
    city: 'Scy-Chazelles',
    serviceTimes: 'Dimanche: 10h00',
    contactInfo: 'Tel: 03 87 60 10 51',
    position: [49.1066, 6.1120]
  },
  {
    id: '11',
    name: 'Église Saint-Joseph',
    denomination: 'Catholic',
    address: 'Rue Saint-Joseph',
    postalCode: '57050',
    city: 'Montigny-lès-Metz',
    serviceTimes: 'Dimanche: 11h00; Samedi: 18h30',
    contactInfo: 'Tel: 03 87 62 35 91',
    position: [49.1030, 6.1344]
  },
  {
    id: '12',
    name: 'Temple Protestant de Marly',
    denomination: 'Protestant',
    address: '5 Rue de la Croix Saint-Joseph',
    postalCode: '57155',
    city: 'Marly',
    serviceTimes: 'Dimanche: 10h30 (alternance avec Montigny)',
    contactInfo: 'Tel: 03 87 62 42 75',
    position: [49.0923, 6.1573]
  },
  {
    id: '13',
    name: 'Église Mennonite',
    denomination: 'Other',
    address: '19 Rue des Bleuets',
    postalCode: '57090',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h30',
    contactInfo: 'Tel: 03 87 74 76 38',
    position: [49.1350, 6.1950]
  },
  {
    id: '14',
    name: 'Église Évangélique Baptiste',
    denomination: 'Evangelical',
    address: '9 Chemin de la Moselle',
    postalCode: '57050',
    city: 'Longeville-lès-Metz',
    serviceTimes: 'Dimanche: 10h00; Mercredi: 19h30 (étude biblique)',
    contactInfo: 'Tel: 03 87 30 36 29',
    website: 'https://eglise-baptiste-metz.fr',
    position: [49.1170, 6.1510]
  },
  {
    id: '15',
    name: 'Église Arménienne',
    denomination: 'Orthodox',
    address: '6 Rue Séverine',
    postalCode: '57070',
    city: 'Metz',
    serviceTimes: 'Dimanche: 10h30 (1er et 3ème du mois)',
    contactInfo: 'Tel: 03 87 74 49 89',
    position: [49.1179, 6.1541]
  }
];